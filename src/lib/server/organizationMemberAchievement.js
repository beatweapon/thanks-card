import { getFirestore } from 'firebase-admin/firestore';

/**
 * 組織メンバーの実績を更新する
 * @param {string} organizationId
 * @param {string} uid
 * @param {import('src/types/organization/memberAchievement').Ahiecements} data
 */
export const updateOrganizationMemberAchivement = async (organizationId, uid, data) => {
	const db = getFirestore();
	const docRef = db.doc(`organizations/${organizationId}/membersAchievement/${uid}`);

	return await docRef.set(data, { merge: true }).catch(async (e) => {
		await docRef.set({});
		await docRef.update(data);
	});
};
