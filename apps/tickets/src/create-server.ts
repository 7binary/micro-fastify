import { join } from 'path';
import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoload from '@fastify/autoload';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { errorHandlerPlugin, authPlugin, kafkaPlugin } from 'fastify-common';

import { env } from './env';
import { prismaPlugin } from './plugins/prisma.plugin';
import { registerServices } from './services';

export const createServer = (): FastifyInstance => {
  const isTest = env.NODE_ENV === 'test';
  const fastify = Fastify({
    trustProxy: true,
    ajv: {
      customOptions: { allErrors: true },
      plugins: [require('ajv-errors')],
    },
    logger: env.NODE_ENV === 'production' ? true : isTest ? false : {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'reqId,req.hostname,req.remoteAddress,req.remotePort',
        },
      },
    },
    pluginTimeout: 99000,
  }).withTypeProvider<TypeBoxTypeProvider>();

  fastify.register(errorHandlerPlugin, { withLog: true, withStack: isTest });
  fastify.register(rateLimit, { max: 150, timeWindow: '1 minute' });
  fastify.register(helmet);
  fastify.register(authPlugin, { secret: env.JWT_SECRET });
  fastify.register(prismaPlugin, { databaseUrl: env.DATABASE_URL, withLog: true });
  fastify.register(kafkaPlugin, { brokers: env.KAFKA_BROKERS, withLog: true, inactive: isTest });
  fastify.register(registerServices);
  fastify.register(autoload, { dir: join(__dirname, 'routes'), ignorePattern: /.*.test.ts/ });

  return fastify;
};
