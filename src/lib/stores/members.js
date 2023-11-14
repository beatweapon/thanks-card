import { writable } from 'svelte/store';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

/**
 * 組織の情報
 * @type {import('svelte/store').Writable<import('src/types/organization/member').OrganizationMember[]>}
 */
export const members = writable([]);

/** @type {import("firebase/firestore").Unsubscribe | undefined} */
let unsubscribe;

/**
 * カードを一覧を監視、更新する
 * @param {string} organizationId
 */
export const watchMemberCollection = (organizationId) => {
	if (unsubscribe) {
		return;
	}

	const collectionRef = collection(db, `organizations/${organizationId}/members/`);
	const q = query(collectionRef, orderBy('createdAt', 'asc'));
	unsubscribe = onSnapshot(q, (snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === 'added') {
				const newMember =
					/** @type {import('src/types/organization/member').OrganizationMember} */ (
						change.doc.data()
					);
				newMember.id = change.doc.id;
				members.update((arr) => [newMember, ...arr]);
			}
			if (change.type === 'modified') {
				members.update((arr) => {
					const index = arr.findIndex((a) => a.id === change.doc.id);
					const newMember =
						/** @type {import('src/types/organization/member').OrganizationMember} */ (
							change.doc.data()
						);

					arr[index].name = newMember.name;
					return arr;
				});
			}
			if (change.type === 'removed') {
				members.update((arr) => {
					const index = arr.findIndex((a) => a.id === change.doc.id);
					const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
					return newArray;
				});
			}
		});
	});
};
