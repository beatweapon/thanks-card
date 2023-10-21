import { SERVICE_ACCOUNT } from '$env/static/private';
import admin from 'firebase-admin';
/**
 * A function that returns a Firebase server result.
 *
 * @typedef {{
 *   error: false;
 *   data: typeof admin;
 *   msg?: undefined;
 * }} FirebaseServerSuccess
 *
 * @typedef {{
 *   error: true;
 *   msg: string;
 *   data?: undefined;
 * }} FirebaseServerError
 *
 * @returns {FirebaseServerSuccess | FirebaseServerError}
 */
export function getFirebaseServer() {
	try {
		if (!admin.apps.length) {
			const serviceAccount =
				/** @type {import('firebase-admin').ServiceAccount} */ JSON.parse(SERVICE_ACCOUNT);
			const cert = admin.credential.cert(serviceAccount);
			admin.initializeApp({ credential: cert });
		}
		return { error: false, data: admin };
	} catch (error) {
		console.error(error);
		return { error: true, msg: 'Error initializing firebase server' };
	}
}
