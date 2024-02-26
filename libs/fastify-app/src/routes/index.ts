import { FastifyPluginCallback } from 'fastify';

import exampleRoute from './example.route';

export const registerRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(exampleRoute);

  done();
};
