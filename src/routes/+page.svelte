<script>
	import NotificationPermission from 'src/lib/components/NotificationPermission.svelte';
	export let data;

	const organizations = data.currentUser?.organizations || [];
</script>

<h1>Welcome to ThanksCard</h1>

{#if data.currentUser?.uid}
	<NotificationPermission uid={data.currentUser.uid} />
{/if}

{#each organizations as organization}
	<a href="/{organization}">{organization}</a>
{/each}
