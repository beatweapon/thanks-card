import { ahiecements } from '$lib/data/achievements';

type AhiecementsKeys = keyof typeof ahiecements;

export interface Ahiecements {
	[x: AhiecementsKeys]: import('firebase/firestore').Timestamp;
}
