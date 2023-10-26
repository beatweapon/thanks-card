<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { postCard } from '$lib/stores/card';
	import UserIcon from '$lib/components/UserIcon.svelte';
	export let data;

	const members = data.organization.members || [];

	/**
	 * @type {string}
	 */
	let to = '';

	/**
	 * @type {string}
	 */
	let message = '';

	const sendMessage = async () => {
		await postCard({
			organizationId: $page.params.organizationId,
			from: data.currentUser.uid,
			to,
			message,
		});

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

<h3>誰に送る？</h3>
<div>
	{#each members as member}
		<label>
			<input type="radio" bind:group={to} value={member.id} />
			<UserIcon src={member.picture} />
			{member.name}
		</label>
	{/each}
</div>

<h3>メッセージ</h3>
<textarea bind:value={message} placeholder="感謝のメッセージをどうぞ！" />

<button on:click={sendMessage} disabled={!to || !message}>カードを贈る</button>

<style>
	textarea {
		width: 30rem;
		height: 5rem;
	}
</style>
