import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { sendNotificationToUser } from '$lib/server/notification';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';
import { achieve } from '$lib/server/organizationMemberAchievement';

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
		senderIcon,
		`/${organizationId}`
	);

	const updateStatsFrom = updateOrganizationMemberStats(organizationId, uid, {
		point: FieldValue.increment(5),
		sentReaction: FieldValue.increment(1),
	});

	const updateStatsTo = updateOrganizationMemberStats(organizationId, cardSenderId, {
		receivedReaction: FieldValue.increment(1),
	});

	await Promise.all([
		sendNotification,
		updateStatsFrom,
		updateStatsTo,
		achieve(organizationId, uid, 'sendReaction'),
	]);

	return new Response();
};
