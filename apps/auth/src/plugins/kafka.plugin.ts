import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { Consumer, Kafka, KafkaMessage, logLevel, Partitioners, Producer } from 'kafkajs';

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
  metadataMaxAge?: number;
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

  let isConnected = false;
  const timeouts = { prev: 0, curr: 1, tmp: 0 };

  const metadataMaxAge = opts.metadataMaxAge ?? 3600000 * 96; // 96 hours = 4 days
  const maxTimeoutSeconds = opts.maxTimeoutSeconds ?? 120;
  const createPartitioner = Partitioners.DefaultPartitioner;

  async function connect() {
    // instance
    const kafka = new Kafka({
      clientId: opts.clientId || 'micro-kafka',
      brokers: opts.brokers!,
      logLevel: logLevel.ERROR,
    });

    // producer
    const producer = kafka.producer({ createPartitioner, metadataMaxAge });
    producer.on('producer.connect', () => {
      opts.withLog && fastify.log.info(`[KAFKA] CONNECTED => ${opts.brokers}`);
    });
    producer.on('producer.disconnect', () => {
      opts.withLog && fastify.log.error('[KAFKA] producer.disconnect');
    });
    await producer.connect();

    // consumer creation
    const addConsumer = async (params: AddConsumerParams): Promise<Consumer | null> => {
      if (!fastify.kafka.instance) {
        return null;
      }

      const { groupId, topic, eachMessage, fromBeginning } = params;
      const consumer = fastify.kafka.instance.consumer({ groupId: groupId || 'default' });
      await consumer.subscribe({ topic, fromBeginning });
      eachMessage && await consumer.run({
        eachMessage: async ({ message }) => eachMessage(message),
      });

      if (fastify.kafka.consumers.has(topic)) {
        await fastify.kafka.consumers.get(topic)!.disconnect();
      }
      fastify.kafka.consumers.set(topic, consumer);

      return consumer;
    };

    // decorator export
    fastify.decorate('kafka', {
      instance: kafka,
      producer,
      consumers: new Map(),
      addConsumer,
    });

    // shut down
    fastify.addHook('onClose', async (fastify) => {
      if (!fastify.kafka) {
        return;
      }
      await fastify.kafka.producer.disconnect();
      const consumers = fastify.kafka.consumers;
      if (consumers.size > 0) {
        await Promise.all(Array.from(consumers.values()).map(con => con.disconnect()));
      }
      isConnected = false;
    });
  }

  // connect loop
  while (!isConnected) {
    try {
      await connect();
      isConnected = true;
    } catch (err: any) {
      fastify.log.error(err, '[KAFKA] <<< INIT ERROR >>>');
      await new Promise(resolve => setTimeout(resolve, timeouts.curr * 1000));

      if (timeouts.curr < maxTimeoutSeconds) {
        timeouts.tmp = timeouts.curr;
        timeouts.curr = timeouts.curr + timeouts.prev;
        timeouts.prev = timeouts.tmp;
      }
    }
  }

}, { name: 'kafka' });
