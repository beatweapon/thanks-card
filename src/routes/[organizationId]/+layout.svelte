<script>
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
  import { page } from '$app/stores';
  import { stats } from '$lib/stores/memberStats';
  import Header from '$lib/components/Header.svelte';
  import { fetchStats } from '$lib/stores/memberStats';
  import { watchMemberAchievementCollection } from '$lib/stores/membersAchievement.js';
  import { watchStatsCollection } from '$lib/stores/memberStats.js';
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
  watchStatsCollection($page.params.organizationId, data.currentUser.uid);

  onMount(async () => {
    await fetchStats($page.params.organizationId, data.currentUser.uid);
  });
</script>

<Header
  organizationName={data.organization?.name}
  organizationId={$page.params.organizationId}
  thanksPoint={$stats?.point}
/>

<AchievementToast />

<main class="main">
  <slot />
</main>

<style>
  .main {
    margin: 0 0.5rem;
  }
</style>
