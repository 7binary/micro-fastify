import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import addTicketRoute from './add-ticket.route';
import readTicketRoute from './read-ticket.route';
import ticketsListRoute from './tickets-list.route';

export const registerRoutes = fp(async (fastify: FastifyInstance) => {
  fastify.register(addTicketRoute);
  fastify.register(readTicketRoute);
  fastify.register(ticketsListRoute);
});
