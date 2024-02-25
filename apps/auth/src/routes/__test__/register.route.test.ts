import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from '@/create-server';

const app = createServer();
beforeAll(async () => void await app.ready());
afterAll(async () => void await app.close());

test('Register', async () => {
  const [userEmail, userPw] = ['register@gmail.com', 'register@AB234'];

  const registerInvalidEmail = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: 'invalid@email', password: userPw },
  });
  expect(registerInvalidEmail.statusCode).equal(400, 'returns a 400 with invalid email');

  const registerInvalidPassword = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: '-' },
  });
  expect(registerInvalidPassword.statusCode).equal(400, 'returns a 400 with invalid password');

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  expect(registerSuccess.statusCode).equal(201, 'returns a 201 on success registration');

  const registerDuplicateEmail = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  expect(registerDuplicateEmail.statusCode).equal(400, 'returns a 400 with duplicate email');
});
