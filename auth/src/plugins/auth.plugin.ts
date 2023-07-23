import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';

export type JwtPayload = {id: number};

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      generateAuthTokens: (payload: JwtPayload) => AuthTokens;
      verify: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
      verifyOptional: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
      verifyCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

interface PluginOptions {
  secret: string;
  cookieName?: string;
  accessTokenLives?: string;
  refreshTokenLives?: string;
}

export const authPlugin: FastifyPluginAsync<PluginOptions> =
  fp(async (fastify: FastifyInstance, opts: PluginOptions) => {

    fastify.register(jwt, {
      secret: opts.secret,
      cookie: {
        cookieName: opts.cookieName || 'refreshToken',
        signed: false,
      },
    });

    const generateAuthTokens = (payload: JwtPayload): AuthTokens => {
      const accessToken = fastify.jwt.sign(payload, {
        expiresIn: opts.accessTokenLives || '15m',
      });
      const refreshToken = fastify.jwt.sign(payload, {
        expiresIn: opts.refreshTokenLives || '14d',
      });

      return { accessToken, refreshToken };
    };

    const verify = async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    };

    const verifyOptional = async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {}
    };

    const verifyCookie = async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify({ onlyCookie: true });
      } catch (err) {
        reply.send(err);
      }
    };

    fastify.decorate('auth', {
      generateAuthTokens,
      verify,
      verifyOptional,
      verifyCookie,
    });
  });
