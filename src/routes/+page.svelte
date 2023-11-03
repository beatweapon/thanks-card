<script>
	export let data;

	const organizations = data.currentUser?.organizations || [];
</script>

<h1>Welcome to ThanksCard</h1>

{#each organizations as organization}
	<a href="/{organization}">{organization}</a>
{/each}
