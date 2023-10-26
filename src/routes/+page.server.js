import { getFirestore } from 'firebase-admin/firestore';

/**
 * @typedef {Object} CurrentUser
 * @property {string} uid
 * @property {string} [email]
 * @property {string} [picture]
 * @property {string[]} [organizations]
 */

export const load = async ({ locals }) => {
	/** @type {CurrentUser | undefined} */
	let currentUser = undefined;

	if (locals.currentUser) {
		const user = await fetchUser(locals.currentUser.uid);
		currentUser = {
			...locals.currentUser,
			...user,
		};
	}

	return { currentUser };
};

/**
 * ユーザー情報を取得する
 * @param {string} uid
 *
 * @typedef {Object} User
 * @property  {string[]} organizations
 */
const fetchUser = async (uid) => {
	const db = getFirestore();

	const docRef = db.doc(`users/${uid}`);
	const docSnap = await docRef.get();

	if (docSnap.exists) {
		return /** @type {User} */ (docSnap.data());
	}
};
