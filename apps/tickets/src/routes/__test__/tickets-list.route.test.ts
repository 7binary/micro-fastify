import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Tickets List', async () => {
  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });

  const addTicket = async (title: string, price: number) => app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title, price },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await addTicket('First ticket', 1);
  await addTicket('Second ticket', 2);

  const ticketsSuccess = await app.inject({
    method: 'GET',
    path: '/api/tickets',
  });
  expect(ticketsSuccess.statusCode).equal(200, 'returs a 200 on success');
  const tickets = ticketsSuccess.json();
  expect(Array.isArray(tickets) && tickets.length >= 2,
    'tickets is array of 2 records').toBeTruthy();
});
