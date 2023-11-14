<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let data;

	const organizations = data.currentUser?.organizations || [];

	onMount(() => {
		if (organizations.length === 1) {
			goto(`${$page.url}/${organizations[0]}`);
		}
	});
</script>

<h1>Welcome to ThanksCard</h1>

{#each organizations as organization}
	<a href="/{organization}">{organization}</a>
{/each}
