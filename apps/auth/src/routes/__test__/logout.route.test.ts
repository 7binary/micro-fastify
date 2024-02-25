import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Logout', async () => {
  const [userEmail, userPw] = ['logout@gmail.com', 'logout@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  expect(registerSuccess.statusCode).equal(201, 'has a registered user');
  const accessToken = registerSuccess.json()?.accessToken;

  const logoutSuccess = await app.inject({
    method: 'GET',
    url: '/api/auth/logout',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const refreshToken = logoutSuccess.cookies.find(c => c.name === 'refreshToken')?.value;
  expect(logoutSuccess.statusCode).equal(200, 'returns a 200 on success');
  expect(refreshToken, 'clears the cookie {refreshToken}').toBeFalsy();
});
