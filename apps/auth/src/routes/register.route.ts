import { FastifyPluginCallback } from 'fastify';
import { RegisterDto, RegisterDtoType } from '@/dto/register.dto';

const registerRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: RegisterDtoType}>('/api/auth/register', {
    schema: { body: RegisterDto },
  }, async (request, reply) => {
    const user = await fastify.userService.register(request.body);
    const { accessToken, refreshToken } = fastify.auth.generateAuthTokens(user);
    await fastify.tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(201).send({
      user: fastify.userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default registerRoute;
