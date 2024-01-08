import { PrismaClient, Ticket } from '@prisma/client';
import fastJson from 'fast-json-stringify';

import { TicketDtoType } from '@/dto/ticket.dto';

export class TicketsService {
  stringify: (model: Partial<Ticket>) => string;

  constructor(private readonly prismaTicket: PrismaClient['ticket']) {
    this.stringify = fastJson({
      title: 'Ticket Schema',
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        price: { type: 'number' },
        authorUserId: { type: 'number' },
        soldAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
      },
    });
  }

  toJson(ticket: Ticket): Partial<Ticket> {
    return this.exclude(ticket, ['updatedAt']);
  }

  exclude<Ticket, Key extends keyof Ticket>(model: Ticket, keys: Key[]): Omit<Ticket, Key> {
    for (const key of keys) {
      delete model[key];
    }

    return model;
  }

  async addTicket(dto: TicketDtoType, authorUserId: number) {
    const ticket = await this.prismaTicket.create({
      data: {
        title: dto.title,
        price: dto.price,
        authorUserId: authorUserId,
      },
    });

    return ticket;
  }

  async getTicketsList() {
    const tickets = await this.prismaTicket.findMany({
      orderBy: { id: 'desc' } as const,
    });

    return tickets;
  }
}
