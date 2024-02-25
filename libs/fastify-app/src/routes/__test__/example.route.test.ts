import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Example', async (t) => {
  const [userEmail, userPw] = ['example@gmail.com', 'example@AB234'];

  const exampleSuccess = await app.inject({
    method: 'POST',
    url: '/api/fastify-app/example',
    payload: { email: userEmail, password: userPw },
  });
  expect(exampleSuccess.statusCode).equal(201, 'has example created');
});
