import { createError } from '@fastify/error';

export const ValidationError = createError('Validation Error', '%s', 400);
