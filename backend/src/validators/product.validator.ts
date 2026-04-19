import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
    price: z.number().positive('Price must be a positive number'),
    category: z.string().min(2, 'Category is required'),
    imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(2).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['AVAILABLE', 'SOLD', 'REMOVED']).optional(),
  }),
});

// For query parameters filtering and pagination
export const queryProductSchema = z.object({
  query: z.object({
    page: z.union([z.string(), z.number()]).optional().transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
    limit: z.union([z.string(), z.number()]).optional().transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['AVAILABLE', 'SOLD', 'REMOVED']).optional(),
    sellerId: z.string().uuid().optional(),
  }),
});
