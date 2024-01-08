import { FastifyPluginCallback } from 'fastify';
import { RegisterDto, RegisterDtoType } from '@/dto/register.dto';

const registerRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.post<{Body: RegisterDtoType}>('/api/auth/register', {
    schema: { body: RegisterDto },
  }, async (request, reply) => {
    const user = await fastify.userService.register(request.body);
    const { accessToken, refreshToken } = fastify.auth.generateAuthTokens({ id: user.id });
    await fastify.tokenService.saveRefreshToken(user.id, refreshToken);
    const userJson = fastify.userService.toJson(user);

    await fastify.kafkaService.newUserEmit(userJson);

    reply.setCookie('refreshToken', refreshToken).status(201).send({
      user: userJson,
      accessToken,
    });
  });

  done();
};

export default registerRoute;
