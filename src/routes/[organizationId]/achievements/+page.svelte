<script>
	import { ahiecementsMaster } from '$lib/data/achievements';
	import { achievement } from '$lib/stores/membersAchievement';

	$: achievements = Object.entries(ahiecementsMaster).map(([key, value]) => {
		if ($achievement[key]) {
			return { ...value, getDate: $achievement[key] };
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
