import { FastifyPluginCallback } from 'fastify';

const ticketsListRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.get('/api/tickets', async (request, reply) => {
    const tickets = await fastify.ticketsService.getTicketsList();
    const ticketsJson = tickets.map(ticket => fastify.ticketsService.toJson(ticket));

    reply.status(200).send(ticketsJson);
  });

  done();
};

export default ticketsListRoute;
