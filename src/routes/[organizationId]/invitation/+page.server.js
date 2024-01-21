import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ params, request }) => {
    const { organizationId } = params;
    const data = await request.formData();
    const expirationDays = Number(data.get('expirationDays'));
    const count = data.get('count') || 1;

    const db = getFirestore();

    const now = new Date();
    const expirationDaysLater = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000);

    const collectionRef = db.collection(`organizations/${organizationId}/invitationTokens`);
    const docRef = await collectionRef.add({
      expiration: admin.firestore.Timestamp.fromDate(expirationDaysLater),
      count,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    });

    const docSnap = await docRef.get();

    return { token: docSnap.id };
  },
};
