import { writable } from 'svelte/store';
import { collection, Timestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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

	const currentDate = new Date(); // 現在の日付を取得
	const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 現在から7日前の日付を計算

	const timestamp = Timestamp.fromDate(sevenDaysAgo);

	const collectionRef = collection(db, `organizations/${organizationId}/cards/`);
	const q = query(collectionRef, orderBy('createdAt', 'asc'), where('createdAt', '>', timestamp));
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
