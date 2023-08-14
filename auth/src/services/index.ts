import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { UserService } from './user.service';
import { TokenService } from './token.service';

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserService;
    tokenService: TokenService;
  }
}

export const _registerServices = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('userService', new UserService(fastify.prisma.user));
  fastify.decorate('tokenService', new TokenService(fastify.prisma.token));
});
