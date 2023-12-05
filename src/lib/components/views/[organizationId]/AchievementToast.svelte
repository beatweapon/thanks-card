<script>
	import { onDestroy } from 'svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { achievement } from '$lib/stores/membersAchievement';
	import { achievementsMaster } from '$lib/data/achievements';

	/** @type {import('src/types/organization/memberAchievement').Achievements} */
	let achievementValue = {};

	/** @type {import('src/types/organization/memberAchievement').AchiecementsKeys[]} */
	let achievementKeys = [];

	let isToastShow = false;

	const showToast = () => {
		isToastShow = true;
		setTimeout(() => {
			isToastShow = false;
		}, 5000);
	};

	let isStart = false;
	setTimeout(() => {
		isStart = true;
	}, 5000);

	const unsubscribe = achievement.subscribe((newValue) => {
		const newKeys = Object.keys(newValue);
		const oldKeys = Object.keys(achievementValue);

		achievementKeys =
			/** @type {import('src/types/organization/memberAchievement').AchiecementsKeys[]} */ (
				newKeys.filter((key) => !oldKeys.includes(key))
			);

		if (isStart && achievementKeys.length > 0) {
			showToast();
		}

		achievementValue = newValue;
	});

	onDestroy(unsubscribe);
</script>

<Toast show={isToastShow}>
	{#each achievementKeys as key}
		<div>{achievementsMaster[key].title}の実績を解除しました！</div>
	{/each}
</Toast>
