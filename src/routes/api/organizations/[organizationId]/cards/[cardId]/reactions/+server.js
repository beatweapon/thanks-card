import { getFirestore } from 'firebase-admin/firestore';
import { sendNotificationToUser } from '$lib/server/notification';

export const PUT = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId, cardId } = params;
	const { uid, emoji, senderName, senderIcon, cardSenderId } = await request.json();
	const reactions = [{ emoji, uid }];

	const docRef = db.doc(`organizations/${organizationId}/cards/${cardId}`);
	docRef.update({ reactions });

	await sendNotificationToUser(
		cardSenderId,
		`${senderName}がリアクションしました`,
		emoji,
		senderIcon
	);

	return new Response();
};
