import { test } from 'tap';
import { createServer } from '@/create-server';
import { TICKET_MIN_PRICE, TICKET_MAX_PRICE } from '@/dto/ticket.dto';

test('Add Ticket', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });
  const ticket = { title: 'City lights', price: 100500.44 };

  const errUnauthorized = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticket,
  });
  t.equal(errUnauthorized.statusCode, 401, 'returs 401 if unauthorized');

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

  const errPriceMin = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'City lights', price: TICKET_MIN_PRICE - 1 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(errPriceMin.statusCode, 400, 'returs 400 if `price` is too small');

  const errPriceMax = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'City lights', price: TICKET_MAX_PRICE + 1 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(errPriceMax.statusCode, 400, 'returs 400 if `price` is too big');

  const success = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticket,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(success.statusCode, 201, 'returs 201 if ticket is saved');
  const { title, price } = success.json();
  t.equal(title, ticket.title, 'ticket title match');
  t.equal(+price, +ticket.price, 'ticket price match');

  t.end();
});
