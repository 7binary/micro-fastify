import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';
import { TICKET_MIN_PRICE, TICKET_MAX_PRICE } from '@/dto/ticket.dto';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Add Ticket', async () => {
  const { accessToken } = app.auth.generateAuthTokens({ id: 1 });
  const ticket = { title: 'City lights', price: 100500.44 };

  const errUnauthorized = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticket,
  });
  expect(errUnauthorized.statusCode).equal(401, 'returs 401 if unauthorized');

  const errNoTitle = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: '', price: 100500 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(errNoTitle.statusCode).equal(400, 'returs 400 if no `title` provided');

  const errNoPrice = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'City lights', price: undefined },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(errNoPrice.statusCode).equal(400, 'returs 400 if no `price` provided');

  const errPriceMin = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'City lights', price: TICKET_MIN_PRICE - 1 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(errPriceMin.statusCode).equal(400, 'returs 400 if `price` is too small');

  const errPriceMax = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: { title: 'City lights', price: TICKET_MAX_PRICE + 1 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(errPriceMax.statusCode).equal(400, 'returs 400 if `price` is too big');

  const success = await app.inject({
    method: 'POST',
    path: '/api/tickets',
    body: ticket,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(success.statusCode).equal(201, 'returs 201 if ticket is saved');
  const { title, price } = success.json();
  expect(title).equal(ticket.title, 'ticket title match');
  expect(+price).equal(+ticket.price, 'ticket price match');
});
