import { FastifyPluginCallback } from 'fastify';
import { NotAuthorizedError } from 'fastify-common';

const refreshRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.get('/api/auth/refresh', {
    onRequest: [fastify.auth.verifyCookie],
  }, async (request, reply) => {
    const [tokenModel, user] = await Promise.all([
      fastify.tokenService.findRefreshToken(request.cookies.refreshToken!),
      fastify.userService.findOneById(request.user!.id),
    ]);
    if (!tokenModel || !user) {
      throw new NotAuthorizedError();
    }

    const { accessToken, refreshToken } = fastify.auth.generateAuthTokens(user);
    await fastify.tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(200).send({
      user: fastify.userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default refreshRoute;
