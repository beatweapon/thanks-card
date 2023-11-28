import admin from 'firebase-admin';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { sendNotificationToUser } from '$lib/server/notification';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';

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
		createdAt: Timestamp.fromDate(new Date()),
	});

	const sendNotification = sendNotificationToUser(
		to,
		`${senderName}からカードが届きました`,
		message,
		senderIcon
	);

	const updateStatsFrom = updateOrganizationMemberStats(organizationId, from, {
		sent: FieldValue.increment(1),
		lastSendedAt: Timestamp.fromDate(new Date()),
	});

	const updateStatsTo = updateOrganizationMemberStats(organizationId, to, {
		received: FieldValue.increment(1),
		lastReceivedAt: Timestamp.fromDate(new Date()),
	});

	await Promise.all([sendNotification, updateStatsFrom, updateStatsTo]);

	return new Response();
};
