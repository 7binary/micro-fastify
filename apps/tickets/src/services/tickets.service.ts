import { PrismaClient } from '@prisma/client';

export class TicketsService {
  constructor(private readonly prismaToken: PrismaClient['ticket']) {}
}
