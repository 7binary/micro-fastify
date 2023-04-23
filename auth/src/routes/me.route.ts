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

  done();
};

export default meRoute;
