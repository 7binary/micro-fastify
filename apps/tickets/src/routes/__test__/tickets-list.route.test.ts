import { test } from 'tap';
import { createServer } from '@/create-server';

test('Tickets List', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

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
  t.equal(ticketsSuccess.statusCode, 200, 'returs a 200 on success');
  const tickets = ticketsSuccess.json();
  t.equal(Array.isArray(tickets) && tickets.length >= 2, true, 'tickets is array of 2 records');

  t.end();
});
