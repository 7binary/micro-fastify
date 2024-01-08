import * as dotenv from 'dotenv';
import * as envVar from 'env-var';

dotenv.config();
export type NodeEnv = 'production' | 'development' | 'test';

export const env = {
  NODE_ENV: envVar.get('NODE_ENV').default('development').asString() as NodeEnv,
  PORT: envVar.get('PORT').default(3000).asIntPositive(),
  DATABASE_URL: envVar.get('DATABASE_URL').required().asString(),
  JWT_SECRET: envVar.get('JWT_SECRET').required().asString(),
  JWT_LIVES: envVar.get('JWT_LIVES').default('15m').asString(),
  COOKIE_SECRET: envVar.get('COOKIE_SECRET').required().asString(),
  COOKIE_DOMAIN: envVar.get('COOKIE_DOMAIN').default('localhost').asString(),
  KAFKA_BROKERS: envVar.get('KAFKA_BROKERS').asArray() as string[],
};
