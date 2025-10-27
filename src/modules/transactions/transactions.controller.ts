import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/commons/guards';
import { User } from 'src/commons/decorators';
import { IUser } from 'src/commons/utils';

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './transactions.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'transaction',
  version: '1',
})
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions' })
  async getTransactions(@User() user: IUser) {
    return await this.transactionService.getTransactions(user);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Transaction' })
  async createTransaction(@Body() dto: CreateTransactionDto, @User() user: IUser) {
    return await this.transactionService.createTransaction(dto, user);
  }
}
