import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore();

/**
 * ポイントを送信数に合わせてアップデートするデータパッチ処理
 */
export const patchPoint = async () => {
	console.log('pathc');
	const orgSnapShot = await getOrganizations();

	orgSnapShot.forEach(async (orgDoc) => {
		const organizationId = orgDoc.id;
		const collectionRef = db.collection(`organizations/${organizationId}/membersStats`);

		const memberStatsSnapshot = await collectionRef.get();
		memberStatsSnapshot.forEach(async (doc) => {
			const data = doc.data();
			const p = data.sentMessage ? data.sentMessage * 10 : 0;
			const m = data.deletedMessage ? data.deletedMessage * 10 : 0;
			const point = p - m;
			await doc.ref.update({
				point: point,
			});
		});
	});
};

const getOrganizations = async () => {
	const collectionRef = db.collection('organizations');

	return await collectionRef.get();
};
