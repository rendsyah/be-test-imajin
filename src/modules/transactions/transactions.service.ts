import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { IUser, MutationResponse } from 'src/commons/utils';
import { CreateTransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle get transactions
   * @param user
   * @returns
   */
  async getTransactions(user: IUser) {
    const getTransaction = await this.model('transactions')
      .innerJoin('transaction_items', 'transactions.id', 'transaction_items.transaction_id')
      .innerJoin('products', 'products.id', 'transaction_items.product_id')
      .select(
        'transactions.id AS transaction_id',
        'transactions.amount AS transaction_amount',
        'transactions.status AS transaction_status',
        'transactions.created_at AS transaction_created_at',
        'transaction_items.id AS transaction_item_id',
        'transaction_items.product_id AS product_id',
        'products.name AS product_name',
        'transaction_items.quantity AS quantity',
        'transaction_items.amount AS item_amount',
      )
      .where('transactions.user_id', user.id);

    if (getTransaction.length === 0) {
      throw new NotFoundException('Transaction not found');
    }

    // Kelompokkan per transaction
    const grouped = getTransaction.reduce(
      (acc, item) => {
        if (!acc[item.transaction_id]) {
          acc[item.transaction_id] = {
            id: item.transaction_id,
            amount: item.transaction_amount,
            status: item.transaction_status,
            created_at: item.transaction_created_at,
            transaction_items: [],
          };
        }

        acc[item.transaction_id].transaction_items.push({
          id: item.transaction_item_id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          amount: item.item_amount,
        });

        return acc as Record<string, unknown>;
      },
      {} as Record<string, unknown>,
    );

    return Object.values(grouped);
  }

  /**
   * Handle create transaction
   * @param dto
   * @param user
   * @returns
   */
  async createTransaction(dto: CreateTransactionDto, user: IUser): Promise<MutationResponse> {
    await this.model.transaction(async (trx) => {
      const resultTransaction = await trx('transactions')
        .insert({
          user_id: user.id,
          payment_id: dto.payment_id,
          amount: dto.amount,
          status: 0,
        })
        .returning('id');

      await trx('transaction_items').insert(
        dto.items.map((item) => ({
          transaction_id: +resultTransaction[0].id,
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          amount: item.amount,
        })),
      );
    });

    return {
      message: 'Successfully created',
    };
  }
}
