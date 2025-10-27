import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { SkipLogging } from './commons/decorators';

import { AppService } from './app.service';

@Controller({
  path: '/',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @SkipLogging()
  @ApiOperation({ summary: 'Health Check' })
  health() {
    return this.appService.health();
  }
}
