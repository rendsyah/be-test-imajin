import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  payment_id: z.number().min(1),
  amount: z.number().min(1),
  items: z
    .array(
      z.object({
        product_id: z.number().min(1),
        price: z.number().min(1),
        quantity: z.number().min(1),
        amount: z.number().min(1),
      }),
    )
    .min(1),
});
