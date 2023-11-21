<script>
	import { page } from '$app/stores';

	export let isOpen = false;

	const organizationId = $page.params.organizationId;
</script>

<nav class="side_menu" class:open={isOpen}>
	<ul>
		<li class="menu_item">
			<a href={`/${organizationId}/profile`}>名前を変更する</a>
		</li>
		<li class="menu_item">
			<a href={`/${organizationId}/invitation`}>招待URLを発行する</a>
		</li>
	</ul>
</nav>

<style>
	.side_menu {
		position: relative;
		right: -18rem;
		z-index: +1;
		height: calc(100dvh - 2rem);
		width: 18rem;
		max-width: 80dvw;
		transition: all 0.3s ease-in-out;
		overflow: hidden;
		background-color: aliceblue;
	}

	.side_menu.open {
		right: 0;
	}

	.menu_item {
		padding: 1rem;
	}
</style>
