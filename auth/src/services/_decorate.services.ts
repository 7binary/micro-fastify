import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import { HashService } from '@/services/hash.service';
import { UserService } from '@/services/user.service';
import { TokenService } from '@/services/token.service';

declare module 'fastify' {
  interface FastifyInstance {
    hashService: HashService;
    userService: UserService;
    tokenService: TokenService;
  }
}

export const registerServicesPlugin: FastifyPluginAsync = fp(async (fastify, opts) => {
  fastify.decorate('hashService', new HashService());
  fastify.decorate('userService', new UserService(fastify.prisma.user));
  fastify.decorate('tokenService', new TokenService(fastify.prisma.token));
});
