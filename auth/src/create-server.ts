import path from 'path';
import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoload from '@fastify/autoload';
import { errorHandlerPlugin } from 'fastify-common';

import { env } from './env';
import { authJwtPlugin } from './plugins/auth-jwt.plugin';
import { cookiePlugin } from './plugins/cookie.plugin';
import { prismaPlugin } from './plugins/prisma.plugin';

export const createServer = (): FastifyInstance => {
  const fastify = Fastify({
    trustProxy: true,
    logger: envToLogger[env.NODE_ENV] ?? true,
    ajv: {
      customOptions: { allErrors: true },
      plugins: [require('ajv-errors')],
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  fastify.register(errorHandlerPlugin, { withStack: env.NODE_ENV === 'test', withLog: true });
  fastify.register(authJwtPlugin, { secret: env.JWT_SECRET });
  fastify.register(prismaPlugin, { databaseUrl: env.DATABASE_URL, withLog: true });
  fastify.register(cookiePlugin, { secret: env.COOKIE_SECRET, domain: env.COOKIE_DOMAIN });
  fastify.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /.*.test.ts/,
  });

  return fastify;
};

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'reqId,req.hostname,req.remoteAddress,req.remotePort',
      },
    },
  },
  production: true,
  test: false,
};
