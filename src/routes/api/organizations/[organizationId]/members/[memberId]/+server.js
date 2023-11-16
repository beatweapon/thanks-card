import { getFirestore } from 'firebase-admin/firestore';

export const PUT = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId, memberId } = params;
	const { name } = await request.json();

	const docRef = db.doc(`organizations/${organizationId}/members/${memberId}`);
	docRef.update({ name });

	return new Response();
};
