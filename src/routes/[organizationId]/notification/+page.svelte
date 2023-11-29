<script>
	import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { app } from '$lib/firebase_client';
	import { registerDeviceToken } from '$lib/stores/user';
	import Loading from 'src/lib/components/Loading.svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import FloatButton from 'src/lib/components/design/FloatButton.svelte';

	export let data;

	// 通知の許可ステータスを追跡するための変数
	let permissionStatus = 'default';

	onMount(async () => {
		permissionStatus = Notification.permission;

		if (permissionStatus === 'granted') {
			await getDeviceToken();
		}
	});

	// 通知の許可を要求する関数
	const requestNotificationPermission = async () => {
		if (!window.Notification) {
			return;
		}

		try {
			const status = await Notification.requestPermission();
			permissionStatus = status;
		} catch (error) {
			console.error('通知の許可をリクエストできませんでした:', error);
		}

		if (permissionStatus === 'granted') {
			await getDeviceToken();
		}
	};

	const getDeviceToken = async () => {
		const messaging = getMessaging(app);
		const currentToken = await getToken(messaging, {
			vapidKey: PUBLIC_VAPID_KEY,
		}).catch((err) => {
			console.log('An error occurred while retrieving token. ', err);
		});

		if (currentToken) {
			// Send the token to your server and update the UI if necessary
			// ...
			await registerDeviceToken(data.currentUser.uid, currentToken);
			console.log(currentToken);
		} else {
			// Show permission request UI
			console.log('No registration token available. Request permission to generate one.');
			// ...
		}
	};
</script>

<div class="center">
	{#if permissionStatus === ''}
		<Loading />
	{:else if permissionStatus === 'default'}
		<div>
			<p>
				あなたにカードが届いたときや、あなたが贈ったカードにリアクションがついたときに通知を受け取ることができます。
			</p>
			<FloatButton on:click={requestNotificationPermission}>通知を許可する</FloatButton>

			<PlainButton on:click={() => goto(`/${$page.params.organizationId}`)}>スキップ</PlainButton>
		</div>
	{:else if permissionStatus === 'granted'}
		<p>通知が許可されています。通知が来ない場合はOSの通知設定をご確認ください。</p>
	{:else if permissionStatus === 'denied'}
		<p>通知が拒否されています。通知を有効にするにはブラウザの設定を変更してください。</p>
	{/if}
</div>

<style>
	.center {
		margin: 0 1rem;
		height: calc(100dvh - 2rem);
		display: grid;
		justify-content: center;
		align-items: center;
	}
</style>
