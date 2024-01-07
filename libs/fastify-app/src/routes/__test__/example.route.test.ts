import { test } from 'tap';
import { createServer } from '@/create-server';

test('Example', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());

  const [userEmail, userPw] = ['example@gmail.com', 'example@AB234'];

  const exampleSuccess = await app.inject({
    method: 'POST',
    url: '/api/fastify-app/example',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(exampleSuccess.statusCode, 201, 'has example created');
});
