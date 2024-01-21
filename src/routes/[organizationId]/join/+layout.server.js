import { redirect, error } from '@sveltejs/kit';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const load = async ({ parent, params, url }) => {
  const { currentUser, organization } = await parent();

  if (organization.members.some((m) => m.id === currentUser.uid)) {
    throw redirect(303, `/${params.organizationId}`);
  }

  const token = url.searchParams.get('token');

  if (!token) {
    throw error(401, {
      message: 'Token expired',
    });
  }

  const tokenData = await fetchOrganizationInvitationToken(params.organizationId, token);

  if (!tokenData) {
    throw error(401, {
      message: 'Token expired',
    });
  }

  const now = admin.firestore.Timestamp.fromDate(new Date());

  if (tokenData.expiration.toDate() < now.toDate()) {
    deleteOrganizationInvitationToken(params.organizationId, token);

    throw error(401, {
      message: 'Token expired',
    });
  }
};

/**
 * 組織の招待コードを取得する
 * @param {string} organizationId
 * @param {string} token
 */
const fetchOrganizationInvitationToken = async (organizationId, token) => {
  const db = getFirestore();

  const docRef = db.doc(`organizations/${organizationId}/invitationTokens/${token}`);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return /** @type {any} */ (docSnap.data());
  }
};

/**
 * 組織の招待コードを削除する
 * @param {string} organizationId
 * @param {string} token
 */
const deleteOrganizationInvitationToken = async (organizationId, token) => {
  const db = getFirestore();

  const docRef = db.doc(`organizations/${organizationId}/invitationTokens/${token}`);
  await docRef.delete();
};
