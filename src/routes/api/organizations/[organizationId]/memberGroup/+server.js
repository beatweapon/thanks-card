import { getFirestore } from 'firebase-admin/firestore';

export const POST = async ({ request, params }) => {
  const db = getFirestore();

  const { organizationId } = params;
  const { name, memberIds } = await request.json();

  const collectionRef = db.collection(`organizations/${organizationId}/memberGroup`);
  const docRef = await collectionRef.add({
    name,
    memberIds,
  });

  return new Response();
};
