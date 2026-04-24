import type { z } from 'zod';
import type { errorResponse } from '@break-distrib/schemas';

type ErrorCode = z.infer<typeof errorResponse>['error']['code'];

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
