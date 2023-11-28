import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { sendNotificationToUser } from '$lib/server/notification';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';

export const PUT = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId, cardId } = params;
	const { uid, emoji, senderName, senderIcon, cardSenderId } = await request.json();
	const reactions = [{ emoji, uid }];

	const docRef = db.doc(`organizations/${organizationId}/cards/${cardId}`);
	docRef.update({ reactions });

	const sendNotification = sendNotificationToUser(
		cardSenderId,
		`${senderName}がリアクションしました`,
		emoji,
		senderIcon
	);

	const updateStatsFrom = updateOrganizationMemberStats(organizationId, uid, {
		sentReaction: FieldValue.increment(1),
	});

	const updateStatsTo = updateOrganizationMemberStats(organizationId, cardSenderId, {
		receivedReaction: FieldValue.increment(1),
	});

	await Promise.all([sendNotification, updateStatsFrom, updateStatsTo]);

	return new Response();
};
