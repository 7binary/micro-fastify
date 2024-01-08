import { FastifyPluginCallback } from 'fastify';
import { TicketDto, TicketDtoType } from '@/dto/ticket.dto';

const addTicketRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: TicketDtoType}>('/api/tickets', {
    onRequest: [fastify.auth.verify],
    schema: { body: TicketDto },
  }, async (request, reply) => {
    reply.status(200).send('OK');
  });

  done();
};

export default addTicketRoute;
