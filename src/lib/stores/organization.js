import { writable } from 'svelte/store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

/**
 * @typedef Organization
 * @property {string} name 名前
 */

/**
 * 組織の情報
 * @type {import('svelte/store').Writable<Organization>}
 */
export const organization = writable();

/**
 * 組織の情報を取得する
 * @param {string} organizationId
 */
export const fetchOrganization = async (organizationId) => {
	const docRef = doc(db, `organizations`, organizationId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		console.log(docSnap.data());
		organization.set(/** @type {Organization} */ (docSnap.data()));
	}
};

/**
 * @typedef OrganizationUser
 * @property {string} id ID
 * @property {string} name 名前
 */

/**
 * 組織のユーザー情報
 * @type {import('svelte/store').Writable<OrganizationUser>}
 */
export const organizationUser = writable();

/**
 * 組織のユーザー情報を取得する
 * @param {string} organization
 * @param {string} uid
 */
export const fetchOrganizationUser = async (organization, uid) => {
	const docRef = doc(db, `organizations/${organization}/members`, uid);
	const docSnap = await getDoc(docRef);

	console.log(`organizations/${organization}/members`, uid);

	if (docSnap.exists()) {
		console.log(docSnap.data());
		organizationUser.set(/** @type {OrganizationUser} */ (docSnap.data()));
	}
};

/**
 * 組織のユーザー情報を登録する
 * @param {string} organization
 * @param {OrganizationUser} user
 */
export const registerMember = async (organization, user) => {
	await setDoc(doc(db, `organizations/${organization}/members`, user.id), user);

	organizationUser.set(/** @type {OrganizationUser} */ (user));
};
