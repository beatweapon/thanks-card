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

  return resolve(event);
};
