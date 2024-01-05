import { join } from 'path';
import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoload from '@fastify/autoload';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { authPlugin, errorHandlerPlugin } from 'fastify-common';

import { env } from './env';
import { cookiePlugin } from './plugins/cookie.plugin';
import { prismaPlugin } from './plugins/prisma.plugin';
import { kafkaPlugin } from './plugins/kafka.plugin';
import { registerServices } from './services';

export const createServer = (): FastifyInstance => {
  const fastify = Fastify({
    trustProxy: true,
    ajv: {
      customOptions: { allErrors: true },
      plugins: [require('ajv-errors')],
    },
    logger: env.NODE_ENV === 'production' ? true : env.NODE_ENV === 'test' ? false : {
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

  fastify.register(kafkaPlugin, {
    brokers: env.KAFKA_BROKERS,
    withLog: true,
    inactive: env.NODE_ENV === 'test'
  });
  fastify.register(errorHandlerPlugin, { withLog: true, withStack: env.NODE_ENV === 'test' });
  fastify.register(rateLimit, { max: 150, timeWindow: '1 minute' });
  fastify.register(helmet);
  fastify.register(authPlugin, { secret: env.JWT_SECRET });
  fastify.register(prismaPlugin, { databaseUrl: env.DATABASE_URL, withLog: true });
  fastify.register(cookiePlugin, { secret: env.COOKIE_SECRET, domain: env.COOKIE_DOMAIN });
  fastify.register(registerServices);
  fastify.register(autoload, { dir: join(__dirname, 'routes'), ignorePattern: /.*.test.ts/ });

  return fastify;
};
