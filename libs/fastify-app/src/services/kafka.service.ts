import { FastifyInstance } from 'fastify';

export enum KafkaTopics {
  NEW_USER = 'new-user',
}

export class KafkaService {

  constructor(protected readonly fastify: FastifyInstance) {
    this.newUserConsume();
  }

  async newUserConsume() {
    await this.fastify.kafka?.addConsumer({
      topic: KafkaTopics.NEW_USER,
      fromBeginning: true,
      eachMessage: async (message) => {
        const user = JSON.parse(message.value?.toString() || '{}');
        if (Number.isInteger(user?.id)) {
          this.fastify.log.info(user, '[KAFKA] NEW USER =>');
        }
      },
      onConnect: async () => this.newUserEmit({}),
    });
  }

  async newUserEmit(userJson: Record<string, any>) {
    await this.fastify.kafka?.producer.send({
      topic: KafkaTopics.NEW_USER,
      messages: [{
        key: null,
        value: JSON.stringify(userJson),
      }],
    });
  }
}
