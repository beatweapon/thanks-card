import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { getFirebaseServer } from '$lib/server/firebase_server';

export const handle = async ({ event, resolve }) => {
	event.locals.id = '';
	event.locals.email = '';

	const isAuth = event.url.pathname === '/auth';
	if (isAuth || building) {
		event.cookies.set('session', '');
		return await resolve(event);
	}

	const session = event.cookies.get('session') || '';
	const admin = getFirebaseServer();
	if (admin.error) {
		throw redirect(303, '/auth');
	}

	let decodedClaims;
	try {
		decodedClaims = await admin.data.auth().verifySessionCookie(session, false);
	} catch (error) {
		console.error(error);
		throw redirect(303, '/auth');
	}

	const { uid, email } = decodedClaims;
	event.locals.id = uid;
	event.locals.email = email || '';

	if (!event.locals.id) {
		throw redirect(303, '/auth');
	}

	return await resolve(event);
};
