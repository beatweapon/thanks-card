<script>
	import { onMount } from 'svelte';
	import Header from 'src/lib/components/Header.svelte';
	import NotificationPermission from '$lib/components/NotificationPermission.svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import Loading from 'src/lib/components/Loading.svelte';

	export let data;

	// 通知の許可ステータスを追跡するための変数
	let permissionStatus = '';

	onMount(async () => {
		permissionStatus = Notification.permission;
	});
</script>

<Header organizationName={data.organization?.name} />

{#if permissionStatus === ''}
	<div class="center">
		<Loading />
	</div>
{:else if permissionStatus === 'default'}
	<div class="center">
		<div>
			<p>
				あなたにカードが届いたときや、あなたが贈ったカードにリアクションがついたときに通知を受け取ることができます。
			</p>
			<NotificationPermission uid={data.currentUser.uid} />

			<PlainButton on:click={() => (permissionStatus = 'skip')}>スキップ</PlainButton>
		</div>
	</div>
{:else}
	<main class="main">
		<slot />
	</main>
{/if}

<style>
	.main {
		margin: 0.5rem;
	}

	.center {
		margin: 1rem;
		height: calc(100dvh - 40px);
		display: grid;
		justify-content: center;
		align-items: center;
	}
</style>
