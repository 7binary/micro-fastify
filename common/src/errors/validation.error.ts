import { createError } from '@fastify/error';

export const ValidationError = createError<[string]>('Validation Error', '%s', 400);
