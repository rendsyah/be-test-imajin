import { createZodCustomDto } from 'src/commons/zod';
import { DirectUploadSchema, PresignUploadSchema } from './upload.pipe';

export class PresignUploadDto extends createZodCustomDto(PresignUploadSchema) {}

export class DirectUploadDto extends createZodCustomDto(DirectUploadSchema) {}
