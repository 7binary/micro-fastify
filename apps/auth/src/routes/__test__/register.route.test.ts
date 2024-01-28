import { test } from 'tap';
import { createServer } from '@/create-server';

test('Register', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const [userEmail, userPw] = ['register@gmail.com', 'register@AB234'];

  const registerInvalidEmail = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: 'invalid@email', password: userPw },
  });
  t.equal(registerInvalidEmail.statusCode, 400, 'returns a 400 with invalid email');

  const registerInvalidPassword = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: '-' },
  });
  t.equal(registerInvalidPassword.statusCode, 400, 'returns a 400 with invalid password');

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(registerSuccess.statusCode, 201, 'returns a 201 on success registration');

  const registerDuplicateEmail = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(registerDuplicateEmail.statusCode, 400, 'returns a 400 with duplicate email');

  t.end();
});
