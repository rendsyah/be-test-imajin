import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  /**
   * Handle health service
   * @returns
   */
  health() {
    return {
      status: 'up',
    };
  }
}
