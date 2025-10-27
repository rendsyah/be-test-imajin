import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/commons/guards';
import { User } from 'src/commons/decorators';
import { IUser } from 'src/commons/utils';

import { CartsService } from './carts.service';
import { CartDto, CartIdDto, CreateCartDto, UpdateCartDto } from './carts.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'carts',
  version: '1',
})
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get carts' })
  async getCarts(@Query() dto: CartDto, @User() user: IUser) {
    return this.cartsService.getCarts(dto, user);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create cart' })
  async createCart(@Body() dto: CreateCartDto, @User() user: IUser) {
    return this.cartsService.createCart(dto, user);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart' })
  async updateCart(@Param() param: CartIdDto, @Body() dto: UpdateCartDto) {
    return this.cartsService.updateCart(param, dto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete cart' })
  async deleteCart(@Param() param: CartIdDto) {
    return this.cartsService.deleteCart(param);
  }
}
