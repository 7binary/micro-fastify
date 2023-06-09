import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';
import { NotAuthorizedError } from 'fastify-common';

const refreshRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {
  fastify.get('/api/auth/refresh', {
    onRequest: [fastify.authJwtCookie],
  }, async (request, reply) => {
    const tokenModel = await fastify.tokenService
      .findRefreshToken(request.cookies.refreshToken!);
    if (!tokenModel) {
      throw new NotAuthorizedError();
    }

    const user = await fastify.userService.findOneById(request.user.id);
    if (!user) {
      throw new NotAuthorizedError();
    }

    const { accessToken, refreshToken } = await fastify.userService
      .generateAuthTokens(user, fastify.jwt);
    await fastify.tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(200).send({
      user: fastify.userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default refreshRoute;
