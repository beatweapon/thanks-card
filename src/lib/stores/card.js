import { writable } from 'svelte/store';
import {
	collection,
	getDocs,
	addDoc,
	Timestamp,
	query,
	orderBy,
	onSnapshot,
} from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

/**
 * カード一覧
 * @type {import('svelte/store').Writable<import('src/types/organization/card').ThanksCard[]>}
 */
export const cards = writable([]);

/** @type {import("firebase/firestore").Unsubscribe | undefined} */
let unsubscribe;

/**
 * カードを一覧を監視、更新する
 * @param {string} organizationId
 */
export const watchCardCollection = (organizationId) => {
	if (unsubscribe) {
		return;
	}

	const collectionRef = collection(db, `organizations/${organizationId}/cards/`);
	const q = query(collectionRef, orderBy('createdAt', 'asc'));
	unsubscribe = onSnapshot(q, (snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === 'added') {
				const newCard = /** @type {import('src/types/organization/card').ThanksCard} */ (
					change.doc.data()
				);
				cards.update((arr) => [newCard, ...arr]);
				console.log('New city: ', change.doc.data());
			}
			if (change.type === 'modified') {
				console.log('Modified city: ', change.doc.data());
			}
			if (change.type === 'removed') {
				console.log('Removed city: ', change.doc.data());
			}
		});
	});
};

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
