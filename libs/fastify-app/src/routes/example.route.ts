import { FastifyPluginCallback } from 'fastify';
import { ExampleDto, ExampleDtoType } from '@/dto/example.dto';

const exampleRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: ExampleDtoType}>('/api/fastify-app/example', {
    onRequest: [fastify.auth.verify],
    schema: { body: ExampleDto },
  }, async (request, reply) => {
    reply.status(201).send('Created');
  });

  done();
};

export default exampleRoute;
