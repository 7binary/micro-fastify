import { test } from 'tap';
import { createServer } from '@/create-server';

test('Refresh', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const [userEmail, userPw] = ['refresh@gmail.com', 'refresh@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(registerSuccess.statusCode, 201, 'has a registered user');
  const refreshToken = registerSuccess.cookies.find(c => c.name === 'refreshToken')?.value;

  const refreshUnauthorized = await app.inject({
    method: 'GET',
    url: '/api/auth/refresh',
  });
  t.equal(refreshUnauthorized.statusCode, 401, 'returns a 401 without cookie');

  const refreshSuccess = await app.inject({
    method: 'GET',
    url: '/api/auth/refresh',
    cookies: { refreshToken: refreshToken as string },
  });
  const accessToken = refreshSuccess.json()?.accessToken;
  const newRefreshToken = registerSuccess.cookies.find(c => c.name === 'refreshToken')?.value;
  t.equal(refreshSuccess.statusCode, 200, 'returns a 200 on success using cookies');
  t.ok(accessToken, 'success returns json {accessToken}');
  t.ok(newRefreshToken, 'success sets a new cookie {refreshToken}');

  t.end();
});
