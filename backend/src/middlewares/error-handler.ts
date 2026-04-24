import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';
import { fail } from '../lib/response';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      fields[issue.path.join('.')] = issue.message;
    }
    return c.json(fail('VALIDATION_ERROR', 'Erreur de validation des données', fields), 400);
  }

  if (err instanceof AppError) {
    let status = 400;
    switch (err.code) {
      case 'UNAUTHORIZED':
        status = 401;
        break;
      case 'FORBIDDEN':
        status = 403;
        break;
      case 'NOT_FOUND':
        status = 404;
        break;
      case 'CONFLICT':
        status = 409;
        break;
      case 'RATE_LIMITED':
        status = 429;
        break;
      case 'VALIDATION_ERROR':
        status = 400;
        break;
      case 'INTERNAL_ERROR':
        status = 500;
        break;
    }
    return c.json(fail(err.code, err.message, err.fields), status as any);
  }

  // Erreur inconnue
  console.error(`[Error] ${c.req.method} ${c.req.url}:`, err);
  return c.json(fail('INTERNAL_ERROR', 'Une erreur interne est survenue'), 500);
};
