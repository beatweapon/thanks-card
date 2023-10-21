<script>
	export let data;

	const organizations = data.user?.organizations || [];
</script>

<h1>Welcome to SvelteAuth</h1>

<button
	class="border rounded p-2 mt-10 mb-10 bg-gray-800 text-white hover:bg-gray-700"
	on:click={() => (window.location.href = '/auth')}
>
	Logout
</button>

{#each organizations as organization}
	<a href="/{organization}">{organization}</a>
{/each}
