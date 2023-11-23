<script>
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';

	export let isOpen = false;

	const organizationId = $page.params.organizationId;

	const dispatch = createEventDispatcher();

	const close = () => {
		dispatch('close');
	};
</script>

<nav class="side_menu" class:open={isOpen}>
	<ul>
		<li class="menu_item">
			<a on:click={close} href={`/${organizationId}`}>トップページ</a>
		</li>
		<li class="menu_item">
			<a on:click={close} href={`/${organizationId}/myCards`}>自分のカードを見る</a>
		</li>
		<li class="menu_item">
			<a on:click={close} href={`/${organizationId}/profile`}>名前を変更する</a>
		</li>
		<li class="menu_item">
			<a on:click={close} href={`/${organizationId}/notification`}>通知設定</a>
		</li>
		<li class="menu_item">
			<a on:click={close} href={`/${organizationId}/invitation`}>招待URLを発行する</a>
		</li>
	</ul>
</nav>

<style>
	.side_menu {
		position: fixed;
		right: -18rem;
		z-index: +100;
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
