import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Login', async () => {
  const [userEmail, userPw] = ['login@gmail.com', 'login@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  expect(registerSuccess.statusCode).equal(201, 'has a registered user');

  const loginInvalidEmail = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: '-', password: userPw },
  });
  expect(loginInvalidEmail.statusCode).equal(400, 'returns a 400 with invalid email');

  const loginInvalidPassword = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: userEmail, password: '-' },
  });
  expect(loginInvalidPassword.statusCode).equal(400, 'returns a 400 with invalid password');

  const loginSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: userEmail, password: userPw },
  });
  const accessToken = loginSuccess.json()?.accessToken;
  const refreshToken = loginSuccess.cookies.find(c => c.name === 'refreshToken')?.value;
  expect(loginSuccess.statusCode).equal(200, 'returns a 200 on success login');
  expect(accessToken, 'returns json {accessToken}').toBeTruthy();
  expect(refreshToken, 'sets cookie {refreshToken}').toBeTruthy();
});
