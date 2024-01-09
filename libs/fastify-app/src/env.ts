import * as dotenv from 'dotenv';
import * as envVar from 'env-var';

dotenv.config();
export type NodeEnv = 'production' | 'development' | 'test';

const nodeEnv = envVar.get('NODE_ENV').default('development').asString() as NodeEnv;

export const env = {
  NODE_ENV: nodeEnv,
  PORT: envVar.get('PORT').default(3000).asIntPositive(),
  DATABASE_URL: envVar.get('DATABASE_URL').required().asString(),
  JWT_SECRET: envVar.get('JWT_SECRET').required().asString(),
  KAFKA_BROKERS: envVar.get('KAFKA_BROKERS').asArray() as string[],
  isTest: nodeEnv === 'test',
  isDev: nodeEnv === 'development',
  isProd: nodeEnv === 'production',
};
