import { User } from 'src/types/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: User | undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
