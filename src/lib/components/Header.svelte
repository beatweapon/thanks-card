<script>
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import SideMenu from './SideMenu.svelte';

	/** @type {string} */
	export let organizationName;

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
		{organizationName}
	</h1>
	<div class="menu">
		<PlainButton on:click={toggleSideMenu}>メニュー</PlainButton>
	</div>
</header>

<div class="side_menu_area">
	<SideMenu isOpen={isOpenSideMenu} on:close={closeMenu} />
</div>

<style>
	.header {
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

	.side_menu_area {
		position: absolute;
		right: 0;
		z-index: +100;
		overflow: hidden;
	}
</style>
