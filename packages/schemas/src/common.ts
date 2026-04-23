import { z } from 'zod';

export const idParam = z.object({ id: z.string().uuid() });

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const errorResponse = z.object({
  error: z.object({
    code: z.enum([
      'VALIDATION_ERROR',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'CONFLICT',
      'RATE_LIMITED',
      'INTERNAL_ERROR',
    ]),
    message: z.string(),
    fields: z.record(z.string()).optional(),
  }),
});
