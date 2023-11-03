import { fetchUser } from '$lib/server/user';

/**
 * @typedef {Object} CurrentUser
 * @property {string} uid
 * @property {string} [email]
 * @property {string} [picture]
 * @property {string[]} [organizations]
 */

export const load = async ({ locals }) => {
	/** @type {CurrentUser | undefined} */
	let currentUser = undefined;

	if (locals.currentUser) {
		const user = await fetchUser(locals.currentUser.uid);
		currentUser = {
			...locals.currentUser,
			...user,
		};
	}

	return { currentUser };
};
