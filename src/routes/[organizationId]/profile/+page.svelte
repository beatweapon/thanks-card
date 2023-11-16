<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let data;

	/** @type {boolean} */
	let processing = false;

	let name = '';

	/** @type {boolean} */
	$: disabled = !name || processing;

	const changeName = async () => {
		if (disabled) return;

		processing = true;

		const memberId = data.currentUser.uid;

		await fetch(`${base}/api/organizations/${$page.params.organizationId}/members/${memberId}`, {
			method: 'PUT',
			body: JSON.stringify({
				name,
			}),
			headers: { 'content-type': 'application/json' },
		}).finally(() => {
			processing = false;
		});

		goToOrganizationPage();
	};

	const goToOrganizationPage = () => {
		goto(removeLastPathFromURL($page.url.toString()));
	};

	/**
	 * @param {string} url
	 */
	const removeLastPathFromURL = (url) => {
		// 正規表現でURLから最後のスラッシュとその後の文字列を削除
		return url.replace(/\/[^/]+$/, '');
	};
</script>

<div class="center">
	<div>
		<label>
			あなたの名前: <input bind:value={name} />
		</label>
		<button on:click={changeName} {disabled}>変更する</button>
	</div>
	<button on:click={goToOrganizationPage}>戻る</button>
</div>

<style>
	.center {
		height: calc(100dvh - 40px);
		margin: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
</style>
