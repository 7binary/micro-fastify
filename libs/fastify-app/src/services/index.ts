import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { KafkaService } from './kafka.service';

declare module 'fastify' {
  interface FastifyInstance {
    kafkaService: KafkaService;
  }
}

export const registerServices = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('kafkaService', new KafkaService(fastify));
}, { dependencies: ['kafka'] });
