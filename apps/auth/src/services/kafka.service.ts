import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';

export enum KafkaTopics {
  NEW_USER = 'new-user',
}

export class KafkaService {
  readonly groupId = 'auth';

  constructor(protected readonly fastify: FastifyInstance) {
    this.newUserConsume();
  }

  async newUserConsume() {
    await this.fastify.kafka?.addConsumer({
      topic: KafkaTopics.NEW_USER,
      groupId: this.groupId,
      fromBeginning: true,
      eachMessage: async (message) => {
        const user = JSON.parse(message.value?.toString() || '{}');
        if (Number.isInteger(user?.id)) {
          this.fastify.log.info(user, '[KAFKA] NEW USER =>');
        }
      },
    });
    await this.newUserEmit({});
  }

  async newUserEmit(user: Partial<User>) {
    return this.fastify.kafka?.producer.send({
      topic: KafkaTopics.NEW_USER,
      messages: [{
        key: null,
        value: this.fastify.userService.stringify(user),
      }],
    });
  }
}
