import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { ProductDto, ProductSlugDto } from './products.dto';
import { DetailProductResponse, ProductsResponse } from './products.types';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/detail/:slug')
  @ApiOperation({ summary: 'Get detail product' })
  async getDetailProduct(@Param() dto: ProductSlugDto): Promise<DetailProductResponse> {
    return this.productsService.getDetailProduct(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get products' })
  async getProducts(@Query() dto: ProductDto): Promise<ProductsResponse> {
    return this.productsService.getProducts(dto);
  }
}
