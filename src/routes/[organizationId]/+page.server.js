import { getFirestore } from 'firebase-admin/firestore';

export const load = async ({ params }) => {
	const cards = await fetchOrganizationCards(params.organizationId);

	return {
		cards,
	};
};

/**
 * 組織のカード情報を取得する
 * @param {string} organizationId
 */
const fetchOrganizationCards = async (organizationId) => {
	const db = getFirestore();
	const collectionRef = db.collection(`organizations/${organizationId}/cards/`);
	const query = collectionRef.orderBy('createdAt', 'desc');
	const snapshot = await query.get();
	return /** @type {import('src/types/organization/card').ThanksCard[]} */ (
		snapshot.docs.map((s) => {
			const data = s.data();

			return {
				...data,
				createdAt: data.createdAt.toDate(),
			};
		})
	);
};
