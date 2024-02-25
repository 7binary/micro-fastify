import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import exampleRoute from './example.route';

export const registerRoutes = fp(async (fastify: FastifyInstance) => {
  fastify.register(exampleRoute);
});
