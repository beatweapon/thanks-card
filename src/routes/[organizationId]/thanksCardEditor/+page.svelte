<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import User from '$lib/components/User.svelte';
	import CardDesignSelector from '$lib/components/CardDesignSelector.svelte';
	import Card from '$lib/components/Card.svelte';
	export let data;

	const members = data.organization.members || [];

	/** @type {string} */
	let designId = '';

	/** @type {string} */
	let to = '';

	/** @type {string} */
	let message = '';

	/** @type {boolean} */
	let processing = false;

	/** @type {boolean} */
	$: disabled = !to || !message || processing;

	$: card = {
		id: 'new',
		designId,
		from: data.currentUser.uid,
		to,
		message,
		createdAt: undefined,
	};

	const sendMessage = async () => {
		if (disabled) return;

		processing = true;

		const senderId = data.currentUser.uid;
		const sender = members.find((m) => m.id === senderId);

		await fetch(`${base}/api/organizations/${$page.params.organizationId}/cards`, {
			method: 'POST',
			body: JSON.stringify({
				from: senderId,
				to,
				designId,
				message,
				senderName: sender?.name,
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

	/**
	 * @param {KeyboardEvent} event
	 */
	const handleKeyDown = (event) => {
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			sendMessage();
		}
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

<h3>カードデザイン</h3>
<CardDesignSelector
	selectedDesignId={designId}
	on:click={(e) => {
		designId = e.detail.designId;
	}}
/>

<h3>メッセージ</h3>
<textarea
	bind:value={message}
	on:keydown={handleKeyDown}
	placeholder="感謝のメッセージをどうぞ！"
/>

<h3>プレビュー</h3>
<div class="preview">
	<Card {card} {members} />
</div>

<button class="send_button" on:click={sendMessage} {disabled}>カードを贈る</button>

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

	.preview {
		width: 400px;
	}

	.send_button {
		margin-bottom: 2rem;
	}
</style>
