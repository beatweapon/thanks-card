<script>
	/** @type {string} */
	export let organizationName;
</script>

<header class="header">
	<h1 class="organization_name">
		{organizationName}
	</h1>
</header>

<style>
	.header {
		padding: 0.5rem;
		background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
	}

	.organization_name {
		font-size: 1rem;
		color: white;
	}
</style>
