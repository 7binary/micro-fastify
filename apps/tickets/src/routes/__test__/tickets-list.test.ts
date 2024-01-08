import { test } from 'tap';
import { createServer } from '@/create-server';

test('Tickets List', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const ticketsSuccess = await app.inject({
    method: 'GET',
    path: '/api/tickets',
  });
  t.equal(ticketsSuccess.statusCode, 200, 'returs a 200 on success');
  t.equal(Array.isArray(ticketsSuccess.json()), true, 'is array');
});
