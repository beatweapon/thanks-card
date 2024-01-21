import { auth } from '$lib/server/firebase_server';

export const POST = async ({ request, cookies }) => {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const { token } = await request.json();

  const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

  cookies.set('__session', sessionCookie, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: expiresIn / 1000,
  });

  return new Response();
};

export const DELETE = async ({ cookies }) => {
  await auth
    .verifySessionCookie(cookies.get('__session') ?? '')
    .then((token) => auth.revokeRefreshTokens(token.sub))
    .catch(console.error);

  cookies.set('__session', '', {
    path: '/',
    maxAge: 0,
  });

  return new Response();
};
