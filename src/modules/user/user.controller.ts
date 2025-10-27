import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/commons/guards';
import { IUser } from 'src/commons/utils';
import { User } from 'src/commons/decorators';

import { UserService } from './user.service';
import { UserResponse } from './user.types';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get resource user' })
  async getUser(@User() user: IUser): Promise<UserResponse> {
    return await this.userService.getUser(user);
  }
}
