import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';
import { UserService } from '@/services/user.service';
import { NotAuthorizedError } from 'fastify-common';

const meRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {

  const userService = new UserService(fastify.prisma.user);

  fastify.get('/api/auth/me', {
    onRequest: [fastify.authJwt],
  }, async (request, reply) => {
    const user = await userService.findOneById(request.user.id);
    if (!user) {
      throw new NotAuthorizedError();
    }

    reply.status(200).send({
      user: userService.toJson(user),
    });
  });

  fastify.get('/api/auth/me-optional', {
    onRequest: [fastify.authJwtOptional],
  }, async (request, reply) => {
    let userData = null;

    if (request.user?.id) {
      const user = await userService.findOneById(request.user.id);
      if (user) {
        userData = userService.toJson(user);
      }
    }

    reply.status(200).send({
      user: userData,
    });
  });

  done();
};

export default meRoute;
