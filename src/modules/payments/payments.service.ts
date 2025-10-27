import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { PaymentMethodsResponse } from './payments.types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle get payment methods
   * @returns
   */
  async getPaymentMethods(): Promise<PaymentMethodsResponse[]> {
    const getPayments: PaymentMethodsResponse[] = await this.model('payment_methods')
      .leftJoin('payments', 'payment_methods.id', 'payments.method_id')
      .select(
        'payment_methods.id',
        'payment_methods.name',
        this.model.raw(`
            json_agg(
                json_build_object(
                'id', payments.id,
                'name', payments.name
                )
            ) as payments
        `),
      )
      .where('payment_methods.status', 1)
      .andWhere('payments.status', 1)
      .groupBy('payment_methods.id', 'payment_methods.name');

    return getPayments;
  }
}
