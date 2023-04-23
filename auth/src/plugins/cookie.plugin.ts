import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import cookie from '@fastify/cookie';

export const cookiePlugin: FastifyPluginAsync<{
  secret: string;
  domain: string;
  liveDays?: number;
}> = fp(async (fastify, opts) => {

  fastify.register(cookie, {
    secret: opts.secret,
    parseOptions: {
      domain: opts.domain,
      httpOnly: true,
      sameSite: true,
      secure: false,
      maxAge: (60 * 60 * 24) * (opts.liveDays || 14),
    },
  });
});
