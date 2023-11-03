import { getFirestore } from 'firebase-admin/firestore';

/**
 * ユーザー情報を取得する
 * @param {string} uid
 *
 * @typedef {Object} User
 * @property  {string[]} organizations
 * @property  {string[]} deviceTokens
 */
export const fetchUser = async (uid) => {
	const db = getFirestore();

	const docRef = db.doc(`users/${uid}`);
	const docSnap = await docRef.get();

	if (docSnap.exists) {
		return /** @type {User} */ (docSnap.data());
	}
};
