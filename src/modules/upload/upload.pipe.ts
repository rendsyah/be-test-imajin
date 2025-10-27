import { z } from 'zod';

export const PresignUploadSchema = z.object({
  context: z.enum(['uploads']),
  filename: z.string().min(1).max(255),
  filesize: z.number().min(1),
  mimetype: z.enum([
    'image/jpeg',
    'image/png',
    'video/mp4',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]),
});

export const DirectUploadSchema = z.object({
  token: z.string(),
});
