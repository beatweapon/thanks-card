import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const POST = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId } = params;
	const { from, to, message, senderIcon } = await request.json();

	const collectionRef = db.collection(`organizations/${organizationId}/cards`);
	const docRef = await collectionRef.add({
		from,
		to,
		message,
		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
	});

	return new Response();
};
