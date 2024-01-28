import { createError } from '@fastify/error';

export const NotFoundError = createError<[string?]>('Not Found Error', '%s', 404);
