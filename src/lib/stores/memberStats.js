import { writable } from 'svelte/store';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

/**
 * 統計情報
 * @type {import('svelte/store').Writable<import('src/types/organization/memberStats').Stats>}
 */
export const stats = writable();

/** @type {import("firebase/firestore").Unsubscribe | undefined} */
let unsubscribe;

/**
 * 組織メンバーの統計を監視、更新する
 * @param {string} organizationId
 * @param {string} uid
 */
export const watchStatsCollection = async (organizationId, uid) => {
	if (unsubscribe) {
		return;
	}

	const docRef = doc(db, `organizations/${organizationId}/membersStats/${uid}`);

	unsubscribe = onSnapshot(docRef, (doc) => {
		if (doc.exists()) {
			stats.set(/** @type {import('src/types/organization/memberStats').Stats} */ (doc.data()));
		}
	});
};

/**
 * 組織メンバーの統計を取得する
 * @param {string} organizationId
 * @param {string} uid
 */
export const fetchStats = async (organizationId, uid) => {
	const docRef = doc(db, `organizations/${organizationId}/membersStats/${uid}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		stats.set(/** @type {import('src/types/organization/memberStats').Stats} */ (docSnap.data()));
	}
};
