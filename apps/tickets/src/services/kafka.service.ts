import { FastifyInstance } from 'fastify';

export enum KafkaTopics {
  NEW_TICKET = 'new-ticket',
}

export class KafkaService {

  constructor(protected readonly fastify: FastifyInstance) {
    this.newUserConsume();
  }

  async newUserConsume() {
    await this.fastify.kafka?.addConsumer({
      topic: KafkaTopics.NEW_TICKET,
      fromBeginning: true,
      eachMessage: async (message) => {
        const ticket = JSON.parse(message.value?.toString() || '{}');
        if (Number.isInteger(ticket?.id)) {
          this.fastify.log.info(ticket, '[KAFKA] NEW TICKET =>');
        }
      },
      onConnect: async () => this.newUserEmit({}),
    });
  }

  async newUserEmit(jsonRecord: Record<string, any>) {
    await this.fastify.kafka?.producer.send({
      topic: KafkaTopics.NEW_TICKET,
      messages: [{
        key: null,
        value: JSON.stringify(jsonRecord),
      }],
    });
  }
}
