import { getFirestore } from 'firebase-admin/firestore';

/**
 * 組織メンバーの統計を取得する
 * @param {string} organizationId
 * @param {string} uid
 */
export const fetchOrganizationMemberStats = async (organizationId, uid) => {
	const db = getFirestore();
	const docRef = db.doc(`organizations/${organizationId}/membersStats/${uid}`);
	const docSnap = await docRef.get();

	if (docSnap.exists) {
		return /** @type {import('src/types/organization/memberStats').Stats} */ (docSnap.data());
	}
};

/**
 * 組織メンバーの統計を更新する
 * @param {string} organizationId
 * @param {string} uid
 * @param {import('src/types/organization/memberStats').UpdateData} data
 */
export const updateOrganizationMemberStats = async (organizationId, uid, data) => {
	const db = getFirestore();
	const docRef = db.doc(`organizations/${organizationId}/membersStats/${uid}`);

	return await docRef.update(data).catch(async (e) => {
		await docRef.set({});
		await docRef.update(data);
	});
};
