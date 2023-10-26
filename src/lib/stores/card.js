import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

/**
 * カードを取得する
 * @param {string} organizationId
 */
export const fetchCards = async (organizationId) => {
	const collectionRef = collection(db, `organizations/${organizationId}/cards/`);
	const querySnapshot = await getDocs(collectionRef);
	return /** @type {import('src/types/organization/card').ThanksCard[]} */ (
		querySnapshot.docs.map((s) => s.data())
	);
};

/**
 * @param {{
 *   organizationId: string
 *   from: string
 *   to: string
 *   message: string
 * }} Param
 */
export const postCard = async ({ organizationId, from, to, message }) => {
	await addDoc(collection(db, `organizations/${organizationId}/cards`), {
		from,
		to,
		message,
		createdAt: Timestamp.now(),
	}).catch((e) => console.error(e));
};
