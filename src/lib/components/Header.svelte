<script>
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import SideMenu from './SideMenu.svelte';

	/** @type {string} */
	export let organizationName;

	/** @type {string} */
	export let organizationId;

	let isOpenSideMenu = false;

	const toggleSideMenu = () => {
		isOpenSideMenu = !isOpenSideMenu;
	};

	const closeMenu = () => {
		isOpenSideMenu = false;
	};
</script>

<header class="header">
	<h1 class="organization_name">
		<a href={`/${organizationId}`}>{organizationName}</a>
	</h1>
	<div class="menu">
		<PlainButton on:click={toggleSideMenu}>メニュー</PlainButton>
	</div>
</header>

<div class="header_space" />

<SideMenu isOpen={isOpenSideMenu} on:close={closeMenu} />

<style>
	.header {
		position: fixed;
		z-index: +101;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 2rem;
		background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
	}

	.organization_name {
		margin-left: 0.5rem;
		font-size: 1rem;
		color: white;
	}

	.menu {
		margin-right: 0.5rem;
		font-weight: bold;
		color: white;
	}

	.header_space {
		height: 2rem;
	}
</style>
