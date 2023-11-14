<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { send, receive } from '$lib/animations/transition.js';
	import { flip } from 'svelte/animate';
	import { cards, watchCardCollection } from '$lib/stores/card.js';
	import { members, watchMemberCollection } from '$lib/stores/members.js';
	import NotificationPermission from '$lib/components/NotificationPermission.svelte';
	import Card from '$lib/components/Card.svelte';
	import Qr from '$lib/components/Qr.svelte';
	import SendRangking from 'src/lib/components/views/[organizationId]/SendRangking.svelte';
	import ReactionEditor from 'src/lib/components/views/[organizationId]/ReactionEditor.svelte';

	export let data;

	watchCardCollection($page.params.organizationId);
	watchMemberCollection($page.params.organizationId);

	const filterOption = { from: '', to: '' };

	/**
	 * カスタムイベントを処理する関数
	 *
	 * @param {string} uid - カスタムイベントオブジェクト
	 * @returns {void}
	 */
	const setFilterOptionFrom = (uid) => {
		filterOption.to = '';
		filterOption.from = filterOption.from !== uid ? uid : '';
	};

	/**
	 * カスタムイベントを処理する関数
	 *
	 * @param {string} uid - カスタムイベントオブジェクト
	 * @returns {void}
	 */
	const setFilterOptionTo = (uid) => {
		filterOption.from = '';
		filterOption.to = filterOption.to !== uid ? uid : '';
	};

	$: filteredCards = $cards.filter((c) => {
		if (filterOption.from && c.from !== filterOption.from) {
			return false;
		}

		if (filterOption.to && c.to !== filterOption.to) {
			return false;
		}

		return true;
	});

	/** @type {Object<string, NodeJS.Timeout>} */
	let cardDeletingSlot = {};

	/**
	 * カード削除処理をスロットに追加する
	 * @param {string} cardId
	 */
	const addCardDeletingSlot = (cardId) => {
		const timer = setTimeout(() => {
			deleteCard(cardId);
		}, 5000);

		cardDeletingSlot[cardId] = timer;
	};

	/**
	 * カード削除をキャンセルする
	 * @param {string} cardId
	 */
	const removeCardDeletingSlot = (cardId) => {
		clearTimeout(cardDeletingSlot[cardId]);

		delete cardDeletingSlot[cardId];
		cardDeletingSlot = cardDeletingSlot;
	};

	/**
	 * カード削除処理
	 * @param {string} cardId
	 */
	const deleteCard = async (cardId) => {
		await fetch(`${base}/api/organizations/${$page.params.organizationId}/cards/${cardId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
		});
	};

	/**
	 * リアクション追加処理
	 * @param {import('src/types/organization/card').ThanksCard} card
	 * @param {string} emoji
	 */
	const addReaction = async (card, emoji) => {
		const senderId = data.currentUser.uid;
		const sender = $members.find((m) => m.id === senderId);

		await fetch(
			`${base}/api/organizations/${$page.params.organizationId}/cards/${card.id}/reactions`,
			{
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					uid: senderId,
					emoji,
					senderName: sender?.name,
					senderIcon: data.currentUser.picture,
					cardSenderId: card.from,
				}),
			}
		);
	};
</script>

<h2>Welcome to TopPage</h2>
<button on:click={() => goto(`${$page.url}/thanksCardEditor`)}>カードを送る</button>

<h2>Send Ranking</h2>
<SendRangking
	cards={$cards}
	members={$members}
	on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
/>

<h2>Thanks Cards</h2>

<ul class="cards">
	{#each filteredCards as card (card.id)}
		<li
			class="card_wrap"
			class:deleting={cardDeletingSlot[card.id] !== undefined}
			in:receive={{ key: card.id }}
			out:send={{ key: card.id }}
			animate:flip={{ duration: 200 }}
		>
			<Card
				{card}
				members={$members}
				on:clickFrom={() => setFilterOptionFrom(card.from)}
				on:clickTo={() => setFilterOptionTo(card.to)}
			>
				<div class="reaction_area">
					{#if card.to === data.currentUser.uid}
						<ReactionEditor
							{card}
							on:clickEmoji={(e) => addReaction(e.detail.card, e.detail.emoji)}
						/>
					{:else if card.reactions}
						<span class="reaction">{card.reactions[0].emoji}</span>
					{/if}
				</div>
			</Card>
			{#if card.from === data.currentUser.uid}
				{#if !cardDeletingSlot[card.id]}
					<button
						on:click={() => {
							addCardDeletingSlot(card.id);
						}}>削除</button
					>
				{:else if cardDeletingSlot[card.id]}
					<button
						on:click={() => {
							removeCardDeletingSlot(card.id);
						}}>やっぱりやめる</button
					>
				{/if}
			{/if}
		</li>
	{/each}
</ul>

<h2>この画面のQRコード</h2>
<Qr url={$page.url.href} />

{#if data.currentUser?.uid}
	<NotificationPermission uid={data.currentUser.uid} />
{/if}

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		gap: 1rem;
	}

	.card_wrap {
		opacity: 1;
	}

	.card_wrap.deleting {
		/* カードの表示非表示のアニメーションとぶつかるため削除の見た目を優先 */
		opacity: 0 !important;
		transition: all 5s;
	}

	.reaction_area {
		display: flex;
		justify-content: end;
		position: relative;
	}

	.reaction {
		-webkit-text-fill-color: initial;
	}
</style>
