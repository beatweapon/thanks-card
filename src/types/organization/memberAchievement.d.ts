import { achiecementsMaster } from '$lib/data/achievements';

export type AchiecementsKeys = keyof typeof achiecementsMaster;

export type Achievements = {
	[K in AchiecementsKeys]?: any;
};
