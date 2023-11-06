<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PlainButton from '$lib/components/PlainButton.svelte';
	import User from '$lib/components/User.svelte';
	export let data;

	const members = data.organization.members || [];

	/** @type {string} */
	let to = '';

	/** @type {string} */
	let message = '';

	/** @type {boolean} */
	let processing = false;

	/** @type {boolean} */
	$: disabled = !to || !message || processing;

	const sendMessage = async () => {
		processing = true;

		await fetch(`${base}/api/organizations/${$page.params.organizationId}/card`, {
			method: 'POST',
			body: JSON.stringify({
				from: data.currentUser.uid,
				to,
				message,
				senderIcon: data.currentUser.picture,
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

<h2>Card Editor</h2>
<!-- {$page.params.organizationId}
<pre>
  {JSON.stringify(data, null, 2)}
</pre> -->
<button on:click={() => goToOrganizationPage()}>戻る</button>

<h3>誰に送る？</h3>
<div class="members">
	{#each members as member}
		<PlainButton on:click={() => (to = member.id)}>
			<div class="member" class:selected={to === member.id}>
				<User user={member} />
			</div>
		</PlainButton>
	{/each}
</div>

<h3>メッセージ</h3>
<textarea bind:value={message} placeholder="感謝のメッセージをどうぞ！" />

<button on:click={sendMessage} {disabled}>カードを贈る</button>

<style>
	.members {
		display: flex;
		flex-wrap: wrap;
	}

	.member {
		border: 1px solid #ddd;
		border-radius: 0.4rem;
		padding: 0.5rem;
		margin: 0.5rem;
	}

	.member.selected {
		border: 1px solid #f00;
	}

	textarea {
		font-size: 1rem;
		max-width: 90%;
		width: 30rem;
		height: 5rem;
	}
</style>
