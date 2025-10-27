import { z } from 'zod';

export const CartIdSchema = z.object({
  id: z.string().uuid(),
});

export const CartSchema = z.object({
  page: z.preprocess((value) => Number(value), z.number().min(1)),
  limit: z.preprocess((value) => Number(value), z.number().min(1).max(100)),
});

export const CreateCartSchema = z.object({
  product_id: z.number().min(1),
  quantity: z.number().min(1),
});

export const UpdateCartSchema = z.object({
  quantity: z.number().min(1),
});
