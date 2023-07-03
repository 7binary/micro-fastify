import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';

const logoutRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {
  fastify.get('/api/auth/logout', async (request, reply) => {
    const cookieRefreshToken = request.cookies?.refreshToken as string;

    if (cookieRefreshToken && fastify.jwt.verify(cookieRefreshToken)) {
      await fastify.tokenService.removeRefreshToken(cookieRefreshToken);
    }

    reply.clearCookie('refreshToken').status(200).send({
      result: 'OK'
    });
  });

  done();
};

export default logoutRoute;
