import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import cookie from '@fastify/cookie';

interface PluginOptions {
  secret: string;
  domain: string;
  liveDays?: number;
}

export const cookiePlugin: FastifyPluginAsync<PluginOptions> =
  fp(async (fastify: FastifyInstance, opts: PluginOptions) => {

    fastify.register(cookie, {
      secret: opts.secret,
      parseOptions: {
        path: '/',
        domain: opts.domain,
        httpOnly: true,
        sameSite: true,
        secure: false,
        maxAge: (60 * 60 * 24) * (opts.liveDays || 14),
      },
    });
  });
