import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import path from 'path';
import fs from 'fs';

import { AppConfigService } from 'src/commons/config';
import { MutationResponse, UtilsService } from 'src/commons/utils';

import { DirectUploadDto, PresignUploadDto } from './upload.dto';
import { VerifyUpload } from './upload.types';

@Injectable()
export class UploadService {
  private readonly MAX_SIZE = 10 * 1024 * 1024;
  private readonly TMP_DIR = path.resolve(process.cwd(), '..', 'public', 'tmp');

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Handle presign upload service
   * @param dto
   * @returns
   */
  async presignUpload(dto: PresignUploadDto): Promise<MutationResponse> {
    if (dto.filesize > this.MAX_SIZE) {
      throw new BadRequestException('File size is too large');
    }

    const generateNow = new Date().getTime();
    const generateRandom = this.utilsService.validateRandomChar(10, 'alphanumeric');
    const generateExt = path.extname(dto.filename);
    const generateFilename = `${generateNow}_${generateRandom}${generateExt}`;

    const generateExpires = 60 * 5;
    const generateToken = await this.jwtService.signAsync(
      {
        context: dto.context,
        filename: generateFilename,
        mimetype: dto.mimetype,
      },
      {
        secret: this.appConfigService.JWT_SECRET,
        expiresIn: generateExpires,
      },
    );

    const generateURL = `/api/v1/upload/direct?token=${generateToken}`;

    return {
      message: 'Presign URL successfully created',
      url: generateURL,
      expires_in: generateExpires,
    };
  }

  /**
   * Handle direct upload service
   * @param dto
   * @returns
   */
  async directUpload(dto: DirectUploadDto): Promise<MutationResponse> {
    try {
      const verify: VerifyUpload = await this.jwtService.verifyAsync(dto.token, {
        secret: this.appConfigService.JWT_SECRET,
      });

      if (!fs.existsSync(this.TMP_DIR)) {
        fs.mkdirSync(this.TMP_DIR, { recursive: true });
      }

      const filename = path.join('/media', verify.context, verify.filename);
      const savePath = path.resolve(this.TMP_DIR, verify.filename);

      return {
        message: 'Upload successfully',
        filename,
        savePath,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
