<script>
	import { registerMember } from 'src/lib/stores/organization';
	import { registerUser } from 'src/lib/stores/user';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Header from 'src/lib/components/Header.svelte';
	import NotificationPermission from '$lib/components/NotificationPermission.svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';

	export let data;
	const members = data.organization?.members || [];

	$: isMember = members.map((m) => m.id).includes(data.currentUser.uid);

	let name = '';
	const join = async () => {
		const user = { id: data.currentUser.uid, name, picture: data.currentUser.picture };
		await Promise.all([
			registerMember($page.params.organizationId, user),
			registerUser(data.currentUser.uid, $page.params.organizationId),
		]);

		location.reload();
	};

	// 通知の許可ステータスを追跡するための変数
	let permissionStatus = 'default';

	onMount(async () => {
		permissionStatus = Notification.permission;
	});
</script>

<Header organizationName={data.organization?.name} />

{#if !isMember}
	<div class="center">
		<div>
			<h1>サンクスカード</h1>
			<p>{data.organization?.name}のサンクスカードに参加して感謝の気持ちを贈り合いましょう！</p>
			<label>
				あなたの名前: <input bind:value={name} />
			</label>
			<button on:click={join}>参加する</button>
		</div>
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
