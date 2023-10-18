import { env } from './env';
import { createServer } from './create-server';

const fastify = createServer();

fastify.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(env, '[SERVER] ENV');
  fastify.log.info(`[SERVER] API ${address.replace('0.0.0.0', 'localhost')}`);
});
