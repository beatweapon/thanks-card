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
<div class="members">
	{#each members as member}
		<label class="member" class:selected={to === member.id}>
			<input type="radio" bind:group={to} value={member.id} class="radio" />
			<span class="icon">
				<UserIcon src={member.picture} />
			</span>
			{member.name}
		</label>
	{/each}
</div>

<h3>メッセージ</h3>
<textarea bind:value={message} placeholder="感謝のメッセージをどうぞ！" />

<button on:click={sendMessage} disabled={!to || !message}>カードを贈る</button>

<style>
	.members {
		display: flex;
		flex-wrap: wrap;
	}

	.member {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 0.4rem;
		padding: 0.5rem;
		margin: 0.5rem;
	}

	.member.selected {
		border: 1px solid #f00;
	}

	.radio {
		display: none;
	}

	.icon {
		display: flex;
		margin-right: 0.5rem;
	}

	textarea {
		width: 30rem;
		height: 5rem;
	}
</style>
