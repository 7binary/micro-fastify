import { FastifyInstance } from 'fastify';
import { Consumer } from 'kafkajs';

export enum KafkaTopics {
  NEW_USER = 'new_user',
}

export class KafkaService {

  constructor(protected readonly fastify: FastifyInstance) {
    this.newUserConsume();
  }

  async newUserConsume(): Promise<Consumer> {
    return this.fastify.kafka.addConsumer({
      topic: KafkaTopics.NEW_USER,
      eachMessage: async (message) => {
        const user = JSON.parse(message.value?.toString() || '{}');
        this.fastify.log.info(user, '[KAFKA] NEW USER =>');
      },
    });
  }

  async newUserEmit(userJson: Record<string, any>) {
    this.fastify.kafka.producer && await this.fastify.kafka.producer.send({
      topic: KafkaTopics.NEW_USER,
      messages: [
        { value: JSON.stringify(userJson) },
      ],
    });
  }
}
