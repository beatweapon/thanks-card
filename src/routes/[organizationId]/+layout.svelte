<script>
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import Header from 'src/lib/components/Header.svelte';
	import { fetchStats } from '$lib/stores/memberStats';
	import { watchMemberAchievementCollection } from '$lib/stores/membersAchievement.js';
	import AchievementToast from '$lib/components/views/[organizationId]/AchievementToast.svelte';

	export let data;

	if ($page.url.pathname !== `/${$page.params.organizationId}/join`) {
		if (!data.organization.members.some((m) => m.id === data.currentUser.uid)) {
			throw error(401, {
				message: 'Not authorized',
			});
		}
	}

	watchMemberAchievementCollection($page.params.organizationId, data.currentUser.uid);

	onMount(async () => {
		await fetchStats($page.params.organizationId, data.currentUser.uid);
	});
</script>

<Header organizationName={data.organization?.name} organizationId={$page.params.organizationId} />

<AchievementToast />

<main class="main">
	<slot />
</main>

<style>
	.main {
		margin: 0 0.5rem;
	}
</style>
