import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';
import { TokenService } from '@/services/token.service';

const logoutRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {

  const tokenService = new TokenService(fastify.prisma.token);

  fastify.get('/api/auth/logout', async (request, reply) => {
    const cookieRefreshToken = request.cookies?.refreshToken as string;

    if (cookieRefreshToken && fastify.jwt.verify(cookieRefreshToken)) {
      await tokenService.removeRefreshToken(cookieRefreshToken);
    }

    reply.clearCookie('refreshToken').status(200).send({
      result: 'OK'
    });
  });

  done();
};

export default logoutRoute;
