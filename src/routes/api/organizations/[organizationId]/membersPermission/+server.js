import { auth } from '$lib/server/firebase_server';
import { getFirestore } from 'firebase-admin/firestore';

export const PUT = async ({ request, params, cookies }) => {
  const session = cookies.get('__session') || '';
  if (!session) {
    return new Response('Forbidden', { status: 403 });
  }

  const decodedClaims = await auth.verifySessionCookie(session);
  const { uid } = decodedClaims;
  const { organizationId } = params;

  const db = getFirestore();
  const docRef = db.collection(`organizations/${organizationId}/members`).doc(uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!docSnap.data()?.permission.admin) {
    return new Response('Forbidden', { status: 403 });
  }

  const { members } = await request.json();

  const batch = db.batch(); // バッチ処理を使用して一括更新
  members.forEach((m) => {
    const docRef = db.collection(`organizations/${organizationId}/members`).doc(m.id);
    batch.update(docRef, { permission: m.permission });
  });

  await batch.commit(); // まとめてコミット

  return new Response();
};
