import { test } from 'tap';
import { createServer } from '@/create-server';

test('Example', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
});
