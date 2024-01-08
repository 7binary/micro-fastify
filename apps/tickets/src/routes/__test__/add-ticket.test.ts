import { test } from 'tap';
import { createServer } from '@/create-server';

test('Add Ticket', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });
  const title = 'City lights';
  const price = 100500.44;
  const ticketData = { title, price };

  const errForbidden = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticketData,
  });
  t.equal(errForbidden.statusCode, 401, 'returs 401 if unauthorized');

  const errNoTitle = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: '', price: 100500 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(errNoTitle.statusCode, 400, 'returs 400 if no `title` provided');

  const errNoPrice = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'City lights', price: undefined },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(errNoPrice.statusCode, 400, 'returs 400 if no `price` provided');

  const success = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticketData,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(success.statusCode, 201, 'returs 201 if ticket is saved');
  t.equal(success.json()?.title, title);
  t.equal(+success.json()?.price, +price);
});
