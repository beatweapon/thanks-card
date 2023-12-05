import { achievementsMaster } from '$lib/data/achievements';

export type AchiecementsKeys = keyof typeof achievementsMaster;

export type Achievements = {
	[K in AchiecementsKeys]?: any;
};
