import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';
import { UserService } from '@/services/user.service';
import { TokenService } from '@/services/token.service';
import { NotAuthorizedError } from 'fastify-common';

const refreshRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {

  const userService = new UserService(fastify.prisma.user);
  const tokenService = new TokenService(fastify.prisma.token);

  fastify.get('/api/auth/refresh', {
    onRequest: [fastify.authJwtCookie],
  }, async (request, reply) => {
    const tokenModel = await tokenService.findRefreshToken(request.cookies.refreshToken!);
    if (!tokenModel) {
      throw new NotAuthorizedError();
    }

    const user = await userService.findOneById(request.user.id);
    if (!user) {
      throw new NotAuthorizedError();
    }

    const { accessToken, refreshToken } = await userService.generateAuthTokens(user, fastify.jwt);
    await tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(200).send({
      user: userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default refreshRoute;
