import { getFirestore } from 'firebase-admin/firestore';

export const load = async ({ locals }) => {
	const user = fetchUser(locals.id);

	return {
		user,
		id: locals.id,
		email: locals.email
	};
};

/**
 * ユーザー情報を取得する
 * @param {string} uid
 *
 * @typedef  {{
 *   organizations: string[]
 * }} User
 */
const fetchUser = async (uid) => {
	const db = getFirestore();

	const docRef = db.doc(`users/${uid}`);
	const docSnap = await docRef.get();

	if (docSnap.exists) {
		return /** @type {User} */ (docSnap.data());
	}
};
