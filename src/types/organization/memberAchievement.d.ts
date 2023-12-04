import { ahiecementsMaster } from '$lib/data/achievements';

export type AhiecementsKeys = keyof typeof ahiecementsMaster;

export interface Ahievements {
	[x: string]: import('firebase/firestore').Timestamp;
}
