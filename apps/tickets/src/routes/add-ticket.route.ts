import { FastifyPluginCallback } from 'fastify';
import { TicketDto, TicketDtoType } from '@/dto/ticket.dto';

const addTicketRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: TicketDtoType}>('/api/tickets', {
    onRequest: [fastify.auth.verify],
    schema: { body: TicketDto },
  }, async (request, reply) => {
    const ticket = await fastify.ticketsService.addTicket(request.body, request.user!.id);
    const ticketJson = fastify.ticketsService.toJson(ticket);

    await fastify.kafkaService.newTicketEmit(ticketJson);

    reply.status(201).send(ticketJson);
  });

  done();
};

export default addTicketRoute;
