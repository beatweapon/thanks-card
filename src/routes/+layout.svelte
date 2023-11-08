<script>
	import './global.css';
	import auth from '$lib/auth';
	export let data;

	const signIn = async () => {
		await auth.signIn();
		location.reload();
	};

	const signOut = async () => {
		await auth.signOut();
		location.reload();
	};
</script>

{#if data.currentUser}
	<slot />
	<!-- <button on:click={signOut}> Logout </button> -->
{:else}
	<button on:click={signIn}> Login using Google </button>
{/if}
