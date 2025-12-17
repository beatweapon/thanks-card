import { auth } from '$lib/server/firebase_server';

export const handle = async ({ event, resolve }) => {
  const session = event.cookies.get('__session') || '';

  if (session) {
    const decodedClaims = await auth.verifySessionCookie(session);
    const { uid, email, picture } = decodedClaims;
    event.locals.currentUser = {
      uid,
      email,
      picture,
    };
  } else {
    event.locals.currentUser = undefined;
  }

  try {
    return await resolve(event);
  } catch (e) {
    // If route not found, return a normal 404 response instead of bubbling an error.
    if (e && e.status === 404) {
      return new Response('Not Found', { status: 404 });
    }
    throw e;
  }
};
