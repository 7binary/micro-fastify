import { FastifyInstance } from 'fastify';
import { Ticket } from '@prisma/client';

export enum KafkaTopics {
  NEW_TICKET = 'new-ticket',
}

export class KafkaService {
  readonly groupId = 'tickets';

  constructor(protected readonly fastify: FastifyInstance) {
    this.newTicketConsume();
  }

  async newTicketConsume() {
    await this.fastify.kafka?.addConsumer({
      topic: KafkaTopics.NEW_TICKET,
      groupId: this.groupId,
      fromBeginning: true,
      eachMessage: async (message) => {
        const ticket = JSON.parse(message.value?.toString() || '{}');
        if (Number.isInteger(ticket?.id)) {
          this.fastify.log.info(ticket, '[KAFKA] NEW TICKET =>');
        }
      },
    });
    await this.newTicketEmit({});
  }

  async newTicketEmit(ticket: Partial<Ticket>) {
    return this.fastify.kafka?.producer.send({
      topic: KafkaTopics.NEW_TICKET,
      messages: [{
        key: null,
        value: this.fastify.ticketsService.stringify(ticket),
        // value: JSON.stringify(ticket),
      }],
    });
  }
}
