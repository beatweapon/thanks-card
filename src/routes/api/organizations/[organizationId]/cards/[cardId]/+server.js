import { getFirestore } from 'firebase-admin/firestore';

export const DELETE = async ({ params }) => {
	const db = getFirestore();

	const { organizationId, cardId } = params;

	const docRef = db.doc(`organizations/${organizationId}/cards/${cardId}`);
	docRef.delete();

	return new Response();
};
