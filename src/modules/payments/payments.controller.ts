import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/commons/guards';

import { PaymentsService } from './payments.service';
import { PaymentMethodsResponse } from './payments.types';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/methods')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment methods' })
  async getPaymentMethods(): Promise<PaymentMethodsResponse[]> {
    return await this.paymentsService.getPaymentMethods();
  }
}
