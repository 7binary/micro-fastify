import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { Consumer, Kafka, KafkaMessage, Producer, Partitioners } from 'kafkajs';

declare module 'fastify' {
  interface FastifyInstance {
    kafka: {
      instance: Kafka;
      producer: Producer;
      consumers: Map<string, Consumer>;
      addConsumer: (params: AddConsumerParams) => Promise<Consumer | null>;
    };
  }
}

interface KafkaPluginOptions {
  brokers: string[];
  clientId?: string;
  maxTimeoutSeconds?: number;
  withLog?: boolean;
}

interface AddConsumerParams {
  topic: string;
  eachMessage?: (message: KafkaMessage) => Promise<void>;
  groupId?: string;
  fromBeginning?: boolean;
}

export const kafkaPlugin = fp(async (fastify: FastifyInstance, opts: KafkaPluginOptions) => {
  if (!Array.isArray(opts.brokers) || !opts.brokers[0]) {
    return;
  }

  const maxTimeoutSeconds = opts.maxTimeoutSeconds ?? 120;
  let isConnected = false;
  const timeouts = { prev: 0, curr: 1, tmp: 0 };

  async function connect() {
    const kafka = new Kafka({
      clientId: opts.clientId || 'micro-kafka',
      brokers: opts.brokers!,
    });
    const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();

    const addConsumer = async (params: AddConsumerParams): Promise<Consumer | null> => {
      if (!fastify.kafka.instance) {
        return null;
      }
      const { groupId, topic, eachMessage, fromBeginning } = params;
      const consumer = fastify.kafka.instance.consumer({ groupId: groupId || 'default' });
      await consumer.subscribe({ topic, fromBeginning });
      eachMessage && await consumer.run({
        eachMessage: async ({ message }) => await eachMessage(message),
      });
      fastify.kafka.consumers.set(topic, consumer);

      return consumer;
    };

    fastify.decorate('kafka', {
      instance: kafka,
      producer,
      consumers: new Map(),
      addConsumer,
    });

    fastify.addHook('onClose', async (fastify) => {
      await fastify.kafka.producer.disconnect();
      const consumers = fastify.kafka.consumers;
      if (consumers.size > 0) {
        await Promise.all(Array.from(consumers.values()).map(con => con.disconnect()));
      }
      isConnected = false;
    });
  }

  while (!isConnected) {
    try {
      await connect();
      isConnected = true;
      opts.withLog && fastify.log.info(`[KAFKA] CONNECTED => ${opts.brokers}`);
    } catch (err: any) {
      opts.withLog && fastify.log.error('[KAFKA] <<< INIT ERROR >>>');
      opts.withLog && fastify.log.error(err);
      await new Promise(resolve => setTimeout(resolve, timeouts.curr * 1000));

      if (timeouts.curr < maxTimeoutSeconds) {
        timeouts.tmp = timeouts.curr;
        timeouts.curr = timeouts.curr + timeouts.prev;
        timeouts.prev = timeouts.tmp;
      }
    }
  }

}, { name: 'kafka' });
