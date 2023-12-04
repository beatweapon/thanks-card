import { writable } from 'svelte/store';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

/**
 * 実績
 * @type {import('svelte/store').Writable<import('src/types/organization/memberAchievement').Achievements>}
 */
export const achievement = writable({});

/** @type {import("firebase/firestore").Unsubscribe | undefined} */
let unsubscribe;

/**
 * 実績を監視、更新する
 * @param {string} organizationId
 * @param {string} uid
 */
export const watchMemberAchievementCollection = (organizationId, uid) => {
	if (unsubscribe) {
		return;
	}

	const docRef = doc(db, `organizations/${organizationId}/membersAchievement/${uid}`);

	unsubscribe = onSnapshot(docRef, (doc) => {
		achievement.set(
			/** @type {import('src/types/organization/memberAchievement').Achievements} */ (doc.data())
		);
	});
};
