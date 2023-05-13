import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    authJwt: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authJwtOptional: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authJwtCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {id: number};
    user: {id: number};
  }
}

export const authJwtPlugin: FastifyPluginAsync<{
  secret: string;
  cookieName?: string;
}> = fp(async (fastify, opts) => {

  fastify.register(jwt, {
    secret: opts.secret,
    cookie: {
      cookieName: opts.cookieName || 'refreshToken',
      signed: false,
    },
  });

  fastify.decorate('authJwt', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('authJwtOptional', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {}
  });

  fastify.decorate('authJwtCookie', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify({ onlyCookie: true });
    } catch (err) {
      reply.send(err);
    }
  });
});
