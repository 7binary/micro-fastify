import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Refresh', async () => {
  const [userEmail, userPw] = ['refresh@gmail.com', 'refresh@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  expect(registerSuccess.statusCode).equal(201, 'has a registered user');
  const refreshToken = registerSuccess.cookies.find(c => c.name === 'refreshToken')?.value;

  const refreshUnauthorized = await app.inject({
    method: 'GET',
    url: '/api/auth/refresh',
  });
  expect(refreshUnauthorized.statusCode).equal(401, 'returns a 401 without cookie');

  const refreshSuccess = await app.inject({
    method: 'GET',
    url: '/api/auth/refresh',
    cookies: { refreshToken: refreshToken as string },
  });
  const accessToken = refreshSuccess.json()?.accessToken;
  const newRefreshToken = registerSuccess.cookies.find(c => c.name === 'refreshToken')?.value;
  expect(refreshSuccess.statusCode).equal(200, 'returns a 200 on success using cookies');
  expect(accessToken, 'success returns json {accessToken}').toBeTruthy();
  expect(newRefreshToken, 'success sets a new cookie {refreshToken}').toBeTruthy();
});
