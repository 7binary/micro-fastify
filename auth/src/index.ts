import { env } from './env';
import { createServer } from './create-server';

const fastify = createServer();

fastify.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.info(`=> Server listening at ${address} with ENV`, env);
});
