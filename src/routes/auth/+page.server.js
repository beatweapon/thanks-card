import { redirect } from '@sveltejs/kit';
import { getFirebaseServer } from '$lib/server/firebase_server';

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const token = form.get('token');
		if (!token || typeof token !== 'string') {
			throw redirect(303, '/auth');
		}
		const admin = getFirebaseServer();
		if (admin.error) {
			throw redirect(303, '/auth');
		}

		// Expires in 5 days
		const expiresIn = 60 * 60 * 24 * 5;
		/** @type {string} */
		let sessionCookie;
		try {
			sessionCookie = await admin.data
				.auth()
				.createSessionCookie(token, { expiresIn: expiresIn * 1000 });
		} catch (error) {
			console.error(error);
			throw redirect(303, '/auth');
		}

		cookies.set('session', sessionCookie, {
			maxAge: expiresIn,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		throw redirect(303, '/');
	}
};
