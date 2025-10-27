import { z } from 'zod';

export const ProductSlugSchema = z.object({
  slug: z.string().min(1).max(255).trim(),
});

export const ProductSchema = z.object({
  page: z.preprocess((value) => Number(value), z.number().min(1)),
  limit: z.preprocess((value) => Number(value), z.number().min(1).max(100)),
  category_id: z.number().min(1).optional(),
  search: z.string().min(1).max(255).trim().optional(),
  sort: z.enum(['ASC', 'DESC']).optional(),
});
