import { test } from 'tap';
import { createServer } from '@/create-server';

test('Add Ticket', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });
  const ticket = { title: 'Read City lights', price: 1022.55 };

  const successCreated = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticket,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(successCreated.statusCode, 201, 'returns 201 if ticket is saved');
  const { id } = successCreated.json();
  t.equal(id > 0, true);

  const errNotFound = await app.inject({
    method: 'GET',
    path: '/api/tickets/0',
  });
  t.equal(errNotFound.statusCode, 404, 'returns 404 for missing ticket');

  const successRead = await app.inject({
    method: 'GET',
    path: `/api/tickets/${id}`,
  });
  t.equal(successRead.statusCode, 200, 'returns 200 if ticket is found');

  t.end();
});
