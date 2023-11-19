<script>
	import Header from 'src/lib/components/Header.svelte';

	export let data;
</script>

<Header organizationName={data.organization?.name} />

<main class="main">
	<slot />
</main>

<style>
	.main {
		margin: 0 0.5rem;
	}
</style>
