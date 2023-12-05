import { getFirestore, Timestamp } from 'firebase-admin/firestore';

/**
 * サンクスカード送信の実績を獲得する
 * @param {string} organizationId
 * @param {string} uid
 * @param {import('src/types/organization/memberAchievement').AchiecementsKeys} key
 */
export const achieve = async (organizationId, uid, key) => {
	await updateOrganizationMemberAchivement(organizationId, uid, {
		[key]: Timestamp.fromDate(new Date()),
	});
};

/**
 * 組織メンバーの実績を更新する
 * @param {string} organizationId
 * @param {string} uid
 * @param {import('src/types/organization/memberAchievement').Achievements} data
 */
export const updateOrganizationMemberAchivement = async (organizationId, uid, data) => {
	const db = getFirestore();
	const docRef = db.doc(`organizations/${organizationId}/membersAchievement/${uid}`);

	return await docRef.set(data, { merge: true }).catch(async (e) => {
		await docRef.set({});
		await docRef.update(data);
	});
};
