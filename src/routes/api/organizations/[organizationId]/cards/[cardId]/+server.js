import { auth } from '$lib/server/firebase_server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';
import { achieve } from '$lib/server/organizationMemberAchievement';

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

      await Promise.all([
        achieve(organizationId, uid, 'deleteThanks'),
        updateOrganizationMemberStats(organizationId, uid, {
          point: FieldValue.increment(-10),
          deletedMessage: FieldValue.increment(1),
        }),
      ]);
    }
  }

  return new Response();
};
