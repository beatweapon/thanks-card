<script>
	import { onMount } from 'svelte';
	import './global.css';
	import auth from '$lib/auth';
	import Loading from 'src/lib/components/Loading.svelte';
	import FloatRoundButton from 'src/lib/components/design/FloatRoundButton.svelte';
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
		<h1>Thanks Card</h1>
		<p>感謝の気持ちを伝え合う</p>
		<FloatRoundButton on:click={signIn}>
			<div class="button_inner">
				<div class="icon">
					<svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 48 48"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						style="display: block;"
					>
						<path
							fill="#EA4335"
							d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
						/>
						<path
							fill="#4285F4"
							d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
						/>
						<path
							fill="#FBBC05"
							d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
						/>
						<path
							fill="#34A853"
							d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
						/>
						<path fill="none" d="M0 0h48v48H0z" />
					</svg>
				</div>
				<span> Sign in with Google </span>
			</div>
		</FloatRoundButton>
	</div>
{/if}

<style>
	.center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		width: 100%;
	}

	.button_inner {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
	}

	.icon {
		width: 1rem;
		height: 1rem;
		margin-right: 0.5rem;
	}
</style>
