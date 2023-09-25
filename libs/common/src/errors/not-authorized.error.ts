import { createError } from '@fastify/error';

export const NotAuthorizedError = createError('Not Authorized', 'Not Authorized', 401);
