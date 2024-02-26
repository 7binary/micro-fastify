import { FastifyPluginCallback } from 'fastify';

import addTicketRoute from './add-ticket.route';
import readTicketRoute from './read-ticket.route';
import ticketsListRoute from './tickets-list.route';

export const registerRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(addTicketRoute);
  fastify.register(readTicketRoute);
  fastify.register(ticketsListRoute);

  done();
};

