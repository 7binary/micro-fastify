import { FastifyPluginCallback } from 'fastify';

const readTicketRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.get<{Params: {id: number}}>('/api/tickets/:id', async (request, reply) => {
    const { id } = request.params;
    const ticket = await fastify.ticketsService.getTicketById(+id);
    const ticketJson = fastify.ticketsService.toJson(ticket);

    reply.status(200).send(ticketJson);
  });

  done();
};

export default readTicketRoute;
