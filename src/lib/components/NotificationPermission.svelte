<script>
	import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { app } from '$lib/firebase_client';
	import { registerDeviceToken } from '$lib/stores/user';

	/** @type {string} */
	export let uid;

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

		await getDeviceToken();
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
			await registerDeviceToken(uid, currentToken);
			console.log(currentToken);
		} else {
			// Show permission request UI
			console.log('No registration token available. Request permission to generate one.');
			// ...
		}
	};
</script>

{#if permissionStatus === 'default'}
	<button on:click={requestNotificationPermission}>通知を許可する</button>
{:else if permissionStatus === 'granted'}
	<p>通知が許可されました！</p>
{:else if permissionStatus === 'denied'}
	<p>通知が拒否されました。通知を有効にするにはブラウザの設定を変更してください。</p>
{/if}
