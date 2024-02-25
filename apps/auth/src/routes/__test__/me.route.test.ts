import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Me', async () => {
  const [userEmail, userPw] = ['me@gmail.com', 'me@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  expect(registerSuccess.statusCode).equal(201, 'has a registered user');
  const accessToken = registerSuccess.json()?.accessToken;

  const meUnauthorized = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
  });
  expect(meUnauthorized.statusCode).equal(401, 'returns a 401 without jwt-token');

  const meSuccess = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(meSuccess.statusCode).equal(200, 'returns a 200 on success current user');
  expect(meSuccess.json()?.user, 'returns json {user}').toBeTruthy();
});
