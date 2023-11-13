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
				newCard.id = change.doc.id;
				cards.update((arr) => [newCard, ...arr]);
			}
			if (change.type === 'modified') {
				cards.update((arr) => {
					const index = arr.findIndex((a) => a.id === change.doc.id);
					const newCard = /** @type {import('src/types/organization/card').ThanksCard} */ (
						change.doc.data()
					);

					arr[index].reactions = newCard.reactions;
					return arr;
				});
			}
			if (change.type === 'removed') {
				cards.update((arr) => {
					const index = arr.findIndex((a) => a.id === change.doc.id);
					const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
					return newArray;
				});
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
