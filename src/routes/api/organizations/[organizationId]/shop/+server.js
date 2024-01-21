import { FieldValue } from 'firebase-admin/firestore';
import { auth } from '$lib/server/firebase_server';
import { updateOrganizationMemberStats } from '$lib/server/organizationMemberStats';

export const PUT = async ({ request, params, cookies }) => {
  const session = cookies.get('__session') || '';
  if (session) {
    const decodedClaims = await auth.verifySessionCookie(session);
    const { uid } = decodedClaims;
    const { organizationId } = params;
    const { frame, price } = await request.json();

    await updateOrganizationMemberStats(organizationId, uid, {
      point: FieldValue.increment(-price),
      'item.frames': FieldValue.arrayUnion(frame),
    });
  }

  return new Response();
};
