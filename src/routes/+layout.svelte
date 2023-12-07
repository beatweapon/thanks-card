<script>
	import { onMount } from 'svelte';
	import './global.css';
	import auth from '$lib/auth';
	import Loading from 'src/lib/components/Loading.svelte';
	export let data;

	let isProcessing = false;

	const signIn = async () => {
		isProcessing = true;

		await auth.signIn().catch((e) => {
			isProcessing = false;
			throw e;
		});
		location.reload();
	};

	const signOut = async () => {
		await auth.signOut();
		location.reload();
	};

	/**
	 * @type {any|null} deferredPrompt - インストールプロンプトの遅延オブジェクト
	 */
	let deferredPrompt;

	onMount(() => {
		/**
		 * beforeinstallprompt イベントのリスナー
		 * @param {any} e - beforeinstallprompt イベントオブジェクト
		 */
		window.addEventListener('beforeinstallprompt', (e) => {
			console.log('beforeinstallprompt');
			// インストールのポップアップを保持
			deferredPrompt = e;

			// ポップアップをキャンセルして自動的には表示しない
			e.preventDefault();
		});
	});

	// インストールボタンなどのユーザーアクションがあった時にポップアップを表示
	const install = () => {
		if (deferredPrompt) {
			// インストールポップアップを表示
			deferredPrompt.prompt();

			// ポップアップが終了したら、結果を検証
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('ユーザーがインストールを選択');
				} else {
					console.log('ユーザーがインストールをキャンセル');
				}

				// ポップアップの情報をリセット
				deferredPrompt = null;
			});
		}
	};
</script>

{#if isProcessing}
	<div class="center">
		<Loading />
	</div>
{:else if data.currentUser}
	<slot />
	<!-- <button on:click={signOut}> Logout </button> -->
	<button on:click={install}> インストール </button>
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
