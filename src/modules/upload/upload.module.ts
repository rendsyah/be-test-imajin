import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, JwtService],
})
export class UploadModule {}
