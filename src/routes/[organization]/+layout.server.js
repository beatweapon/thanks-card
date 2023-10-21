import { getFirestore } from 'firebase-admin/firestore';

export const load = async ({ locals, params }) => {
	const organization = await fetchOrganization(params.organization);
	const members = await fetchOrganizationMembers(params.organization);

	return {
		user: locals,
		organization: { ...organization, members }
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
 *
 * @typedef  {{
 *   id: string
 *   name: string
 * }} OrganizationMember
 */
const fetchOrganizationMembers = async (organizationId) => {
	const db = getFirestore();
	const collectionRef = db.collection(`organizations/${organizationId}/members/`);
	const snapshot = await collectionRef.get();
	return /** @type {OrganizationMember[]} */ (snapshot.docs.map((s) => s.data()));
};
