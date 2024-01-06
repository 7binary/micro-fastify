import { FastifyPluginCallback } from 'fastify';
import { ExampleDto, ExampleDtoType } from '@/dto/example.dto';

const exampleRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: ExampleDtoType}>('/api/fastify-app/example', {
    onRequest: [fastify.auth.verify],
    schema: { body: ExampleDto },
  }, async (request, reply) => {
    reply.status(200).send('OK');
  });

  done();
};

export default exampleRoute;
