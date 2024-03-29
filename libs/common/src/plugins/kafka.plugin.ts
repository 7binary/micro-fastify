import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { Consumer, Kafka, KafkaMessage, logLevel, Partitioners, Producer } from 'kafkajs';

declare module 'fastify' {
  interface FastifyInstance {
    kafka: {
      instance: Kafka;
      producer: Producer;
      consumers: Record<string, Consumer[]>;
      addConsumer: (params: AddConsumerParams) => Promise<Consumer | null>;
    } | undefined;
  }
}

interface KafkaPluginOptions {
  brokers: string[];
  clientId?: string;
  metadataMaxAge?: number;
  maxTimeoutSeconds?: number;
  withLog?: boolean;
  inactive?: boolean;
}

interface AddConsumerParams {
  topic: string;
  eachMessage?: (message: KafkaMessage) => Promise<void>;
  groupId?: string;
  fromBeginning?: boolean;
  partitionsConsumedConcurrently?: number;
  onConnect?: () => Promise<void>;
}

export const kafkaPlugin = fp(async (fastify: FastifyInstance, opts: KafkaPluginOptions) => {
  if (opts.inactive || !Array.isArray(opts.brokers) || !opts.brokers[0]) {
    return;
  }

  let isConnected = false;
  const timeouts = { prev: 0, curr: 1, tmp: 0 };

  const metadataMaxAge = opts.metadataMaxAge || 3600000 * 96; // 96 hours = 4 days
  const maxTimeoutSeconds = opts.maxTimeoutSeconds || 120;
  const createPartitioner = Partitioners.DefaultPartitioner;

  // Kafka consumer creation
  const addConsumer = async (params: AddConsumerParams): Promise<Consumer | null> => {
    if (!fastify.kafka) {
      return null;
    }

    const { groupId, topic, eachMessage, fromBeginning, onConnect } = params;
    const consumer = fastify.kafka.instance.consumer({ groupId: groupId || 'default' });
    await consumer.subscribe({ topic, fromBeginning });
    eachMessage && await consumer.run({
      partitionsConsumedConcurrently: params.partitionsConsumedConcurrently || 1,
      eachMessage: async ({ message }) => eachMessage(message),
    });

    if (!fastify.kafka.consumers[topic]) {
      fastify.kafka.consumers[topic] = [];
    }
    fastify.kafka.consumers[topic].push(consumer);
    onConnect && await onConnect();

    return consumer;
  };

  // Kafka connect with producer creation
  async function connect() {
    const kafka = new Kafka({
      clientId: opts.clientId ?? 'micro-kafka',
      brokers: opts.brokers,
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

    // decorator export
    fastify.decorate('kafka', {
      instance: kafka,
      producer,
      consumers: {},
      addConsumer,
    });

    // shut down
    fastify.addHook('onClose', async (fastify) => {
      if (!fastify.kafka) {
        return;
      }
      await fastify.kafka.producer.disconnect();

      let consumers: Consumer[] = [];
      for (const [_, topicConsumers] of Object.entries(fastify.kafka.consumers)) {
        consumers = [...consumers, ...topicConsumers];
      }
      if (consumers.length > 0) {
        await Promise.all(consumers.map(con => con.disconnect()));
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
