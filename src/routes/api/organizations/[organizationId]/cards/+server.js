import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { sendNotificationToUser } from '$lib/server/notification';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';
import { achieve } from '$lib/server/organizationMemberAchievement';

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

	const promises = [];
	promises.push(achieve(organizationId, from, 'sendThanks'));

	if (from === to) {
		promises.push(achieve(organizationId, from, 'sendThanksToMe'));
	}

	promises.push(
		sendNotificationToUser(
			to,
			`${senderName}からカードが届きました`,
			message,
			senderIcon,
			`/${organizationId}`
		)
	);

	promises.push(
		updateOrganizationMemberStats(organizationId, from, {
			sentMessage: FieldValue.increment(1),
			lastSentMessageAt: Timestamp.fromDate(new Date()),
		})
	);

	promises.push(
		updateOrganizationMemberStats(organizationId, to, {
			receivedMessage: FieldValue.increment(1),
			lastReceivedMessageAt: Timestamp.fromDate(new Date()),
		})
	);

	await Promise.all(promises);

	return new Response();
};
