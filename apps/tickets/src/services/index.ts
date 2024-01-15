import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { TicketsService } from './tickets.service';
import { KafkaService } from '@/services/kafka.service';

declare module 'fastify' {
  interface FastifyInstance {
    ticketsService: TicketsService;
    kafkaService: KafkaService;
  }
}

export const registerServices = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('ticketsService', new TicketsService(fastify.prisma.ticket));
  fastify.decorate('kafkaService', new KafkaService(fastify));
}, { dependencies: ['prisma', 'kafka'] });
