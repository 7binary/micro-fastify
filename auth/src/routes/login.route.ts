import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction as Done } from 'fastify';
import { LoginDto, LoginDtoType } from '@/dto/login.dto';
import { UserService } from '@/services/user.service';
import { TokenService } from '@/services/token.service';

const loginRoute = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: Done) => {

  const userService = new UserService(fastify.prisma.user);
  const tokenService = new TokenService(fastify.prisma.token);

  fastify.post<{Body: LoginDtoType}>('/api/auth/login', {
    schema: { body: LoginDto },
  }, async (request, reply) => {
    const user = await userService.login(request.body);
    const { accessToken, refreshToken } = await userService.generateAuthTokens(user, fastify.jwt);
    await tokenService.saveRefreshToken(user.id, refreshToken);

    reply.setCookie('refreshToken', refreshToken).status(200).send({
      user: userService.toJson(user),
      accessToken,
    });
  });

  done();
};

export default loginRoute;
