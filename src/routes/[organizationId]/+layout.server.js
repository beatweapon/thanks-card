import { error } from '@sveltejs/kit';
import { getFirestore } from 'firebase-admin/firestore';

export const load = async ({ locals, params, url }) => {
  const currentUser = /** @type  {import('src/routes/+page.server.js').CurrentUser} */ (
    locals.currentUser
  );

  const organization = await fetchOrganization(params.organizationId);

  if (!organization) {
    throw error(404, {
      message: 'Not found',
    });
  }

  const allMembers = await fetchOrganizationMembers(params.organizationId);
  const me = allMembers.find((m) => m.id === currentUser.uid);
  const permission = me?.permission;

  const members = allMembers.filter((m) => m.permission.read);

  // 読み込み権限がないからと言って自身をメンバーから除外するとエラーになるため自身は含める
  if (!members.findIndex((m) => m !== currentUser.uid)) {
    members.push(me);
  }

  return {
    currentUser,
    permission,
    organization: { ...organization, members },
  };
};

/**
 * 組織の情報を取得する
 * @param {string} organizationId
 *
 * @typedef Organization
 * @property {string} name 名前
 */
const fetchOrganization = async (organizationId) => {
  const db = getFirestore();

  const docRef = db.doc(`organizations/${organizationId}`);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return /** @type {Organization} */ (docSnap.data());
  }
};

/**
 * 組織のメンバー情報を取得する
 * @param {string} organizationId
 */
const fetchOrganizationMembers = async (organizationId) => {
  const db = getFirestore();
  const collectionRef = db.collection(`organizations/${organizationId}/members/`);
  const query = collectionRef.orderBy('createdAt', 'desc');
  const snapshot = await query.get();
  return /** @type {import('src/types/organization/member').OrganizationMember[]} */ (
    snapshot.docs.map((s) => {
      const data = s.data();

      return {
        ...data,
        createdAt: data.createdAt.toDate(),
      };
    })
  );
};
