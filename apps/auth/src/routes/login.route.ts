import { FastifyPluginCallback } from 'fastify';
import { LoginDto, LoginDtoType } from '@/dto/login.dto';

const loginRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: LoginDtoType}>('/api/auth/login', {
    schema: { body: LoginDto },
  }, async (request, reply) => {
    const user = await fastify.userService.login(request.body);
    const { accessToken, refreshToken } = fastify.auth.generateAuthTokens(user);
    await fastify.tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(200).send({
      user: fastify.userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default loginRoute;
