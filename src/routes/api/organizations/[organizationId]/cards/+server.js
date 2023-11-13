import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { sendNotificationToUser } from '$lib/server/notification';

export const POST = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId } = params;
	const { from, to, message, designId, senderName, senderIcon } = await request.json();

	const collectionRef = db.collection(`organizations/${organizationId}/cards`);
	const docRef = await collectionRef.add({
		from,
		to,
		designId,
		message,
		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
	});

	await sendNotificationToUser(to, `${senderName}からカードが届きました`, message, senderIcon);

	return new Response();
};
