import { FastifyPluginCallback } from 'fastify';

const logoutRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.get('/api/auth/logout', async (request, reply) => {
    const cookieRefreshToken = request.cookies?.refreshToken as string;

    if (cookieRefreshToken) {
      await fastify.tokenService.removeRefreshToken(cookieRefreshToken);
    }

    reply.clearCookie('refreshToken').status(200).send({
      result: 'OK',
    });
  });

  done();
};

export default logoutRoute;
