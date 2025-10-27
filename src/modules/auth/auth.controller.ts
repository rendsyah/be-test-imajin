import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { LoginResponse } from './auth.types';
import { MutationResponse } from 'src/commons/utils';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register authentication' })
  async register(@Body() dto: RegisterDto): Promise<MutationResponse> {
    return await this.authService.register(dto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login authentication' })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(dto);
  }
}
