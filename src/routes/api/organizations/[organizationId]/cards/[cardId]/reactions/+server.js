import { getFirestore } from 'firebase-admin/firestore';

export const PUT = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId, cardId } = params;
	const { reactions } = await request.json();

	const docRef = db.doc(`organizations/${organizationId}/cards/${cardId}`);
	docRef.update({ reactions });

	return new Response();
};
