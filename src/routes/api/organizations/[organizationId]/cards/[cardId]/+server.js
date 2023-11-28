import { auth } from '$lib/server/firebase_server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';

export const DELETE = async ({ params, cookies }) => {
	const session = cookies.get('__session') || '';
	if (session) {
		const decodedClaims = await auth.verifySessionCookie(session);
		const { uid } = decodedClaims;

		if (uid) {
			const db = getFirestore();

			const { organizationId, cardId } = params;

			const docRef = db.doc(`organizations/${organizationId}/cards/${cardId}`);
			await docRef.delete();

			await updateOrganizationMemberStats(organizationId, uid, {
				deletedMessage: FieldValue.increment(1),
			});
		}
	}

	return new Response();
};
