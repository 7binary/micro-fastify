import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

interface PluginOptions {
  databaseUrl: string;
  maxTimeoutSeconds?: number;
  withLog?: boolean;
}

export const prismaPlugin = fp(async (fastify: FastifyInstance, opts: PluginOptions) => {

  opts.maxTimeoutSeconds = opts.maxTimeoutSeconds ?? 610;
  let isConnected = false;
  const timeouts = { prev: 0, curr: 1, tmp: 0 };

  async function connect() {
    const prisma = new PrismaClient();
    await prisma.$connect();
    fastify.decorate('prisma', prisma);
    fastify.addHook('onClose', async (fastify) => {
      await fastify.prisma.$disconnect();
      isConnected = false;
    });
  }

  while (!isConnected && timeouts.curr <= opts.maxTimeoutSeconds) {
    try {
      await connect();
      isConnected = true;
      opts.withLog && fastify.log.info('[PRISMA] --> CONNECTED <--', opts.databaseUrl);
    } catch (err: any) {
      opts.withLog && fastify.log.error('[PRISMA] <<< INIT ERROR >>>');
      opts.withLog && fastify.log.error(err);
      await new Promise(resolve => setTimeout(resolve, timeouts.curr * 1000));
      timeouts.tmp = timeouts.curr;
      timeouts.curr = timeouts.curr + timeouts.prev;
      timeouts.prev = timeouts.tmp;
    }
  }
}, { name: 'prisma' });
