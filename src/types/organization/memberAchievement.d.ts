import { ahiecementsMaster } from '$lib/data/achievements';

export type AhiecementsKeys = keyof typeof ahiecementsMaster;

export type Achievements = {
	[K in AhiecementsKeys]?: any;
};
