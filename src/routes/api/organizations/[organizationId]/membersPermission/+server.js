import { getFirestore } from 'firebase-admin/firestore';

export const PUT = async ({ request, params }) => {
  const db = getFirestore();

  const { organizationId } = params;
  const { members } = await request.json();

  const batch = db.batch(); // バッチ処理を使用して一括更新
  members.forEach((m) => {
    const docRef = db.collection(`organizations/${organizationId}/members`).doc(m.id);
    batch.update(docRef, { permission: m.permission });
  });

  await batch.commit(); // まとめてコミット

  return new Response();
};
