import { FastifyPluginCallback } from 'fastify';
import { NotAuthorizedError } from 'fastify-common';

const meRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.get('/api/auth/me', {
    onRequest: [fastify.auth.verify],
  }, async (request, reply) => {
    const user = await fastify.userService.findOneById(request.user!.id);
    if (!user) {
      throw new NotAuthorizedError();
    }

    reply.status(200).send({
      user: fastify.userService.toJson(user),
    });
  });

  fastify.get('/api/auth/me-optional', {
    onRequest: [fastify.auth.verifyOptional],
  }, async (request, reply) => {
    if (request.user) {
      const user = await fastify.userService.findOneById(request.user.id);
      if (user) {
        return reply.status(200).send({
          user: fastify.userService.toJson(user),
        });
      }
    }

    reply.status(200).send({ user: null });
  });

  done();
};

export default meRoute;
