import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';
import { RegisterDto, RegisterDtoType } from '@/dto/register.dto';
import { UserService } from '@/services/user.service';
import { TokenService } from '@/services/token.service';

const registerRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {

  const userService = new UserService(fastify.prisma.user);
  const tokenService = new TokenService(fastify.prisma.token);

  fastify.post<{Body: RegisterDtoType}>('/api/auth/register', {
    schema: { body: RegisterDto },
  }, async (request, reply) => {
    const user = await userService.register(request.body);
    const { accessToken, refreshToken } = await userService.generateAuthTokens(user, fastify.jwt);
    await tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(201).send({
      user: userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default registerRoute;
