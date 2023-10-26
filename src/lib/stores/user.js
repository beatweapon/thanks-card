import { writable } from 'svelte/store';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from 'src/lib/firebase_client';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * @typedef User
 * @property {string} uid ユーザーID
 */

/**
 * @type {import('svelte/store').Writable<User|null>}
 */
export const user = writable();

onAuthStateChanged(auth, (u) => {
	if (u) {
		console.log('if', u);
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		user.set({ uid: u.uid });
	} else {
		console.log('else', u);
		user.set(null);
	}
});

/**
 * @type {import('svelte/store').Writable<string[]>}
 */
export const organizations = writable([]);

/**
 *
 * @param {string} uid
 */
export const fetchOrganizations = async (uid) => {
	const docRef = doc(db, 'users', uid);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		organizations.set(/** @type {string[]} */ (docSnap.data()));
	}
};

/**
 *
 * @param {string} uid
 * @param {string} organization
 */
export const registerUser = async (uid, organization) => {
	const docRef = await setDoc(doc(db, 'users', uid), {
		organizations: arrayUnion(organization),
	}).catch((e) => console.error(e));
};
