<script>
	import { error } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import Header from 'src/lib/components/Header.svelte';

	export let data;

	if ($page.url.pathname !== `/${$page.params.organizationId}/join`) {
		if (!data.organization.members.some((m) => m.id === data.currentUser.uid)) {
			throw error(401, {
				message: 'Not authorized',
			});
		}
	}
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
