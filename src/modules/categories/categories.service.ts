import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { CategoriesResponse } from './categories.types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle get categories service
   * @returns
   */
  async getCategories(): Promise<CategoriesResponse[]> {
    const getCategories: CategoriesResponse[] = await this.model('categories')
      .select('id', 'name')
      .where('status', 1);

    return getCategories;
  }
}
