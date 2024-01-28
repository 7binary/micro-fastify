import { test } from 'tap';
import { createServer } from '@/create-server';

test('Logout', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const [userEmail, userPw] = ['logout@gmail.com', 'logout@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(registerSuccess.statusCode, 201, 'has a registered user');
  const accessToken = registerSuccess.json()?.accessToken;

  const logoutSuccess = await app.inject({
    method: 'GET',
    url: '/api/auth/logout',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const refreshToken = logoutSuccess.cookies.find(c => c.name === 'refreshToken')?.value;
  t.equal(logoutSuccess.statusCode, 200, 'returns a 200 on success');
  t.notOk(refreshToken, 'clears the cookie {refreshToken}');

  t.end();
});
