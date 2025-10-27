import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import { IUser } from 'src/commons/utils';

import { UserResponse } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection()
    private readonly model: Knex,
  ) {}

  /**
   * Handle get user service
   * @param user
   * @returns
   */
  async getUser(user: IUser): Promise<UserResponse> {
    const getUser = await this.model('users')
      .select(
        'users.uuid AS id',
        'users.name AS name',
        'users.email AS email',
        'users.phone AS phone',
        'users.image AS image',
      )
      .where('users.id', user.id)
      .first();

    if (!getUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: getUser.id,
      name: getUser.name,
      email: getUser.email,
      phone: getUser.phone,
      image: getUser.image,
    };
  }
}
