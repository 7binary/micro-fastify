import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import loginRoute from './login.route';
import logoutRoute from './logout.route';
import meRoute from './me.route';
import refreshRoute from './refresh.route';
import registerRoute from './register.route';

export const registerRoutes = fp(async (fastify: FastifyInstance) => {
  fastify.register(loginRoute);
  fastify.register(logoutRoute);
  fastify.register(meRoute);
  fastify.register(refreshRoute);
  fastify.register(registerRoute);
});
