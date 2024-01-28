import { test } from 'tap';
import { createServer } from '@/create-server';

test('Me', async (t) => {
  const app = createServer();
  t.teardown(() => app.close());
  await app.ready();

  const [userEmail, userPw] = ['me@gmail.com', 'me@AB234'];

  const registerSuccess = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { email: userEmail, password: userPw },
  });
  t.equal(registerSuccess.statusCode, 201, 'has a registered user');
  const accessToken = registerSuccess.json()?.accessToken;

  const meUnauthorized = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
  });
  t.equal(meUnauthorized.statusCode, 401, 'returns a 401 without jwt-token');

  const meSuccess = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  t.equal(meSuccess.statusCode, 200, 'returns a 200 on success current user');
  t.ok(meSuccess.json()?.user, 'returns json {user}');

  t.end();
});
