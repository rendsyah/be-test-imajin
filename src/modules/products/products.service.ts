import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { UtilsService } from 'src/commons/utils';

import { DetailProductResponse, ProductsResponse } from './products.types';
import { ProductDto, ProductSlugDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly utilsService: UtilsService,

    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle get detail product
   * @param dto
   * @returns
   */
  async getDetailProduct(dto: ProductSlugDto): Promise<DetailProductResponse> {
    const getProduct = await this.model('products')
      .innerJoin('categories', 'products.category_id', 'categories.id')
      .select(
        'products.id AS id',
        'categories.name AS category',
        'products.name AS name',
        'products.slug AS slug',
        'products.description AS description',
        'products.image AS image',
        'products.price AS price',
      )
      .where('slug', dto.slug)
      .first();

    if (!getProduct) {
      throw new NotFoundException('Product not found');
    }

    return {
      id: getProduct.id,
      category: getProduct.category,
      name: getProduct.name,
      slug: getProduct.slug,
      description: getProduct.description,
      image: getProduct.image,
      price: getProduct.price,
    };
  }

  /**
   * Handle get products
   * @param dto
   * @returns
   */
  async getProducts(dto: ProductDto): Promise<ProductsResponse> {
    const pagination = this.utilsService.pagination(dto);

    const { page, limit, skip, orderBy = 'products.id', sort = 'DESC', search } = pagination;

    const baseQuery = this.model('products')
      .innerJoin('categories', 'products.category_id', 'categories.id')
      .where('products.status', 1);

    if (dto.category_id) {
      baseQuery.andWhere('products.category_id', dto.category_id);
    }

    if (search) {
      baseQuery.whereILike('products.name', `%${search}%`);
    }

    const countQuery = baseQuery.clone();
    const itemsQuery = baseQuery
      .select(
        'products.id AS id',
        'categories.name AS category',
        'products.name AS name',
        'products.slug AS slug',
        'products.image AS image',
        'products.price AS price',
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
}
