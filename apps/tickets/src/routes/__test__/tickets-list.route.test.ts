import { test } from 'tap';
import { createServer } from '@/create-server';

test('Tickets List', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });
  await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'First ticket', price: 1 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'Second ticket', price: 2 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const ticketsSuccess = await app.inject({
    method: 'GET',
    path: '/api/tickets',
  });
  t.equal(ticketsSuccess.statusCode, 200, 'returs a 200 on success');
  const tickets = ticketsSuccess.json();
  t.equal(Array.isArray(tickets) && tickets.length >= 2, true, 'tickets is array of 2 records');

  t.end();
});
