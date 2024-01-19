import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore();

/**
 * ポイントを送信数に合わせてアップデートするデータパッチ処理
 */
export const patchPoint = async () => {
	const orgSnapShot = await getOrganizations();

	orgSnapShot.forEach(async (orgDoc) => {
		const organizationId = orgDoc.id;
		const collectionRef = db.collection(`organizations/${organizationId}/membersStats`);

		const memberStatsSnapshot = await collectionRef.get();
		memberStatsSnapshot.forEach(async (doc) => {
			const data = doc.data();
			await doc.ref.update({
				point: data.sentMessage ? data.sentMessage * 10 - data.deletedMessage * 10 : 0,
			});
		});
	});
};

const getOrganizations = async () => {
	const collectionRef = db.collection('organizations');

	return await collectionRef.get();
};
