import { FieldValue } from 'firebase-admin/firestore';
import { auth } from '$lib/server/firebase_server';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';

export const PUT = async ({ request, params, cookies }) => {
  const session = cookies.get('__session') || '';
  if (session) {
    const decodedClaims = await auth.verifySessionCookie(session);
    const { uid } = decodedClaims;
    const { organizationId } = params;
    const { frame, card, price } = await request.json();

    /** @type {{point: FieldValue, 'item.frames'?: FieldValue, 'item.cards'?: FieldValue}} */
    const update = { point: FieldValue.increment(-price) };
    if (frame) {
      update['item.frames'] = FieldValue.arrayUnion(frame);
    }

    if (card) {
      update['item.cards'] = FieldValue.arrayUnion(card);
    }

    await updateOrganizationMemberStats(organizationId, uid, update);
  }

  return new Response();
};
