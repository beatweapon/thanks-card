import { getFirestore } from 'firebase-admin/firestore';

export const PUT = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId, cardId } = params;
	const { emoji, uid } = await request.json();
	const reactions = [{ emoji, uid }];

	const docRef = db.doc(`organizations/${organizationId}/cards/${cardId}`);
	docRef.update({ reactions });

	return new Response();
};
