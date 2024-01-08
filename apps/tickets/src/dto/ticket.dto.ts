import { Static, Type } from '@sinclair/typebox';

export const TicketDto = Type.Object({
  title: Type.String({
    minLength: 3,
    maxLength: 120,
    errorMessage: {
      minLength: 'Title should be a text between 3 and 120 characters',
      maxLength: 'Title should be a text between 3 and 120 characters',
    },
  }),
  price: Type.Number({
    minimum: 1,
    maximum: 1000000,
    errorMessage: {
      minimum: 'Price must be a number between 1 and 1000000',
      maximum: 'Price must be a number between 1 and 1000000',
    },
  }),
});

export type TicketDtoType = Static<typeof TicketDto>;