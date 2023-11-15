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

<main class="main">
	<h1 class="title">Welcome to ThanksCard</h1>

	<h2 class="sub_title">あなたの参加中組織一覧</h2>
	<ul>
		{#each organizations as organization}
			<li>
				<a href="/{organization}">{organization}</a>
			</li>
		{/each}
	</ul>
</main>

<style>
	.main {
		height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.title {
		--color1: #edb658;
		--color2: #e7719b;
		background: linear-gradient(45deg, var(--color1), var(--color2));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.sub_title {
		--color1: #0072b4;
		--color2: #7bc0be;
		background: linear-gradient(45deg, var(--color1), var(--color2));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
