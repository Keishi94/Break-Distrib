import type { z } from 'zod';
import type { errorResponse } from '@break-distrib/schemas';

type ErrorResponse = z.infer<typeof errorResponse>;
type ErrorCode = ErrorResponse['error']['code'];

export function ok<T, M = Record<string, unknown>>(data: T, meta?: M) {
  return meta ? { data, meta } : { data };
}

export function fail(code: ErrorCode, message: string, fields?: Record<string, string>) {
  return {
    error: {
      code,
      message,
      ...(fields && Object.keys(fields).length > 0 ? { fields } : {}),
    },
  };
}
