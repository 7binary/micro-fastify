import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { UserService } from './user.service';
import { TokenService } from './token.service';
import { KafkaService } from '@/services/kafka.service';

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserService;
    tokenService: TokenService;
    kafkaService: KafkaService;
  }
}

export const registerServices = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('userService', new UserService(fastify.prisma.user));
  fastify.decorate('tokenService', new TokenService(fastify.prisma.token));
  fastify.decorate('kafkaService', new KafkaService(fastify));
}, { dependencies: ['prisma', 'kafka'] });
