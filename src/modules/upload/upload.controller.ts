import { Body, Controller, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import fs from 'fs';

import { JwtAuthGuard } from 'src/commons/guards';
import { MutationResponse } from 'src/commons/utils';

import { UploadService } from './upload.service';
import { DirectUploadDto, PresignUploadDto } from './upload.dto';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/presign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Presign upload' })
  async presignUpload(@Body() dto: PresignUploadDto): Promise<MutationResponse> {
    return await this.uploadService.presignUpload(dto);
  }

  @Put('/direct')
  @ApiOperation({ summary: 'Direct upload' })
  async directUpload(
    @Query() dto: DirectUploadDto,
    @Req() request: Request,
  ): Promise<MutationResponse> {
    const result = await this.uploadService.directUpload(dto);

    const { savePath, ...res } = result;

    const stream = fs.createWriteStream(savePath as string);

    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
      request.pipe(stream);
    });

    return res;
  }
}
