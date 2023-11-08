import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { sendMessageToDevice } from '$lib/server/firebase_server';
import { fetchUser } from '$lib/server/user';

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

	const user = await fetchUser(to);

	if (user?.deviceTokens) {
		user.deviceTokens.forEach(async (token) => {
			await sendMessageToDevice(token, `${senderName}からカードが届きました`, message, senderIcon);
		});
	}

	return new Response();
};
