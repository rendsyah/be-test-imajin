import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/commons/guards';

import { CategoriesService } from './categories.service';
import { CategoriesResponse } from './categories.types';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get categories' })
  async getCategories(): Promise<CategoriesResponse[]> {
    return await this.categoriesService.getCategories();
  }
}
