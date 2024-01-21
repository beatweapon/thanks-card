import { base } from '$app/paths';
import { auth } from '$lib/firebase_client';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const signIn = async () => {
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  const token = await cred.user.getIdToken();
  await auth.signOut();
  await registerSessionToken(token);
};

export const signOut = async () => await unregisterSessionToken();

/**
 * @param {string} token
 * @returns
 */
const registerSessionToken = async (token) =>
  await fetch(`${base}/api/session`, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'content-type': 'application/json' },
  });

const unregisterSessionToken = async () => await fetch(`${base}/api/session`, { method: 'DELETE' });

export default {
  signIn,
  signOut,
};
