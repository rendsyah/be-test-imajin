import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { IUser, MutationResponse, UtilsService } from 'src/commons/utils';

import { CartDto, CartIdDto, CreateCartDto, UpdateCartDto } from './carts.dto';
import { CartsResponse } from './carts.types';

@Injectable()
export class CartsService {
  constructor(
    private readonly utilsService: UtilsService,

    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle get carts
   * @param dto
   * @param user
   * @returns
   */
  async getCarts(dto: CartDto, user: IUser): Promise<CartsResponse> {
    const pagination = this.utilsService.pagination(dto);

    const { page, limit, skip, orderBy = 'carts.id', sort = 'DESC' } = pagination;

    const baseQuery = this.model('carts')
      .innerJoin('products', 'carts.product_id', 'products.id')
      .where('carts.user_id', user.id);

    const countQuery = baseQuery.clone();
    const itemsQuery = baseQuery
      .select(
        'carts.uuid AS id',
        'products.id AS product_id',
        'products.name AS product_name',
        'products.price AS product_price',
        'products.image AS product_image',
        'carts.quantity AS quantity',
        'carts.amount AS amount',
      )
      .orderBy(orderBy, sort)
      .offset(Number(skip))
      .limit(Number(limit));

    const [items, countResult] = await Promise.all([itemsQuery, countQuery.count().first()]);

    const totalData = Number(countResult?.count ?? 0);

    return this.utilsService.paginationInfiniteResponse({
      items,
      meta: {
        page,
        limit,
        totalData,
      },
    });
  }

  /**
   * Handle create cart
   * @param dto
   * @param user
   * @returns
   */
  async createCart(dto: CreateCartDto, user: IUser): Promise<MutationResponse> {
    const getCarts = await this.model('carts')
      .innerJoin('products', 'carts.product_id', 'products.id')
      .select('carts.id', 'carts.quantity', 'products.price')
      .where('carts.user_id', user.id)
      .andWhere('carts.product_id', dto.product_id)
      .first();

    if (!getCarts) {
      const getProduct = await this.model('products')
        .select('products.id', 'products.price')
        .where('products.id', dto.product_id)
        .first();

      await this.model('carts').insert({
        user_id: user.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
        amount: +getProduct.price * dto.quantity,
      });
    } else {
      await this.model('carts')
        .where('id', getCarts.id)
        .update({
          quantity: getCarts.quantity + dto.quantity,
          amount: +getCarts.price * (getCarts.quantity + dto.quantity),
        });
    }

    return {
      message: 'Successfully created',
    };
  }

  /**
   * Handle update cart
   * @param param
   * @param dto
   * @returns
   */
  async updateCart(param: CartIdDto, dto: UpdateCartDto): Promise<MutationResponse> {
    const getCarts = await this.model('carts')
      .innerJoin('products', 'carts.product_id', 'products.id')
      .select('carts.id', 'products.price')
      .where('carts.uuid', param.id)
      .first();

    if (!getCarts) {
      throw new NotFoundException('Cart not found');
    }

    await this.model('carts')
      .where('id', getCarts.id)
      .update({
        quantity: dto.quantity,
        amount: +getCarts.price * dto.quantity,
      });

    return {
      message: 'Successfully updated',
    };
  }

  /**
   * Handle delete cart
   * @param param
   * @returns
   */
  async deleteCart(param: CartIdDto): Promise<MutationResponse> {
    const getCarts = await this.model('carts')
      .select('carts.id')
      .where('carts.uuid', param.id)
      .first();

    if (!getCarts) {
      throw new NotFoundException('Cart not found');
    }

    await this.model('carts').where('carts.id', getCarts.id).delete();

    return {
      message: 'Successfully deleted',
    };
  }
}
