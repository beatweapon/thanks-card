<script>
	import './global.css';
	import auth from '$lib/auth';
	import Loading from 'src/lib/components/Loading.svelte';
	export let data;

	let isProcessing = false;

	const signIn = async () => {
		isProcessing = true;

		await auth.signIn().finally(() => {
			isProcessing = false;
		});
		location.reload();
	};

	const signOut = async () => {
		await auth.signOut();
		location.reload();
	};
</script>

{#if isProcessing}
	<div class="center">
		<Loading />
	</div>
{:else if data.currentUser}
	<slot />
	<!-- <button on:click={signOut}> Logout </button> -->
{:else}
	<div class="center">
		<button on:click={signIn}> Login using Google </button>
	</div>
{/if}

<style>
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		width: 100%;
	}
</style>
