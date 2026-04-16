import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'COMPLETED', 'CANCELLED']),
  }),
});
