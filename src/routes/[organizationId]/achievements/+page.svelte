<script>
	import { achievementsMaster } from '$lib/data/achievements';
	import { achievement } from '$lib/stores/membersAchievement';

	$: achievements = Object.entries(achievementsMaster).map(([key, value]) => {
		const akey =
			/** @type {import('src/types/organization/memberAchievement').AchiecementsKeys} */ (key);
		if ($achievement[akey]) {
			return { ...value, getDate: $achievement[akey] };
		} else {
			return { ...value, title: '???' };
		}
	});
</script>

<ul>
	{#each achievements as achievement}
		<li>{achievement.title}: {achievement.description}</li>
	{/each}
</ul>
