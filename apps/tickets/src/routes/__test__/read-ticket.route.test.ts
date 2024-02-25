import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Read Ticket', async () => {
  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });
  const ticket = { title: 'Read City lights', price: 1022.55 };

  const errNotFound = await app.inject({
    method: 'GET',
    path: '/api/tickets/999999',
  });
  expect(errNotFound.statusCode).equal(404, 'returns 404 for missing ticket');

  const successCreated = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticket,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(successCreated.statusCode).equal(201, 'returns 201 if ticket is saved');
  const { id } = successCreated.json();
  expect(id > 0).toBeTruthy();

  const successRead = await app.inject({
    method: 'GET',
    path: `/api/tickets/${id}`,
  });
  expect(successRead.statusCode).equal(200, 'returns 200 if ticket is found');
  const { title, price } = successRead.json();
  expect(title).equal(ticket.title, 'ticket title match');
  expect(+price).equal(+ticket.price, 'ticket price match');
});
