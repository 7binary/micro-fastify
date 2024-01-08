import { test } from 'tap';
import { createServer } from '@/create-server';

test('Login', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const [userEmail, userPw] = ['login@gmail.com', 'login@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(registerSuccess.statusCode, 201, 'has a registered user');

  const loginInvalidEmail = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: '-', password: userPw },
  });
  t.equal(loginInvalidEmail.statusCode, 400, 'returns a 400 with invalid email');

  const loginInvalidPassword = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: userEmail, password: '-' },
  });
  t.equal(loginInvalidPassword.statusCode, 400, 'returns a 400 with invalid password');

  const loginSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: userEmail, password: userPw },
  });
  const accessToken = loginSuccess.json()?.accessToken;
  const refreshToken = loginSuccess.cookies.find(c => c.name === 'refreshToken')?.value;
  t.equal(loginSuccess.statusCode, 200, 'returns a 200 on success login');
  t.ok(accessToken, 'returns json {accessToken}');
  t.ok(refreshToken, 'sets cookie {refreshToken}');
});
