<script>
	import UserIcon from '$lib/components/UserIcon.svelte';

	/** @type {{name: string; picture?: string}} */
	export let user;
</script>

<span class="user">
	<span class="icon">
		<UserIcon src={user.picture} />
	</span>
	{user.name}
</span>

<style>
	.user {
		display: flex;
		align-items: center;
	}

	.icon {
		display: flex;
		margin-right: 0.5rem;
	}
</style>
