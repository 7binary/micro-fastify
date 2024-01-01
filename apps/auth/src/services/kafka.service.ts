import { FastifyInstance } from 'fastify';

export enum KafkaTopics {
  NEW_USER = 'new_user',
}

export class KafkaService {

  constructor(protected readonly fastify: FastifyInstance) {
    this.newUserConsume();
  }

  async newUserConsume() {
    this.fastify.kafka && await this.fastify.kafka.addConsumer({
      topic: KafkaTopics.NEW_USER,
      fromBeginning: true,
      eachMessage: async (message) => {
        const user = JSON.parse(message.value?.toString() || '{}');
        this.fastify.log.info(user, '[KAFKA] NEW USER =>');
      },
    });
  }

  async newUserEmit(userJson: Record<string, any>) {
    this.fastify.kafka && await this.fastify.kafka.producer.send({
      topic: KafkaTopics.NEW_USER,
      messages: [
        { value: JSON.stringify(userJson) },
      ],
    });
  }
}
