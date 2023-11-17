<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cards, watchCardCollection } from '$lib/stores/card.js';
	import { members, watchMemberCollection } from '$lib/stores/members.js';
	import NotificationPermission from '$lib/components/NotificationPermission.svelte';
	import Qr from '$lib/components/Qr.svelte';
	import SendRangking from 'src/lib/components/views/[organizationId]/SendRangking.svelte';
	import CardList from 'src/lib/components/views/[organizationId]/CardList.svelte';

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
<a href={`${$page.url}/profile`}>名前を変更する</a>
<h2>Send Ranking</h2>
<SendRangking
	cards={$cards}
	members={$members}
	on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
/>

<h2>Thanks Cards</h2>
<CardList
	currentUser={data.currentUser}
	cards={filteredCards}
	members={$members}
	{cardDeletingSlot}
	on:clickFrom={(e) => setFilterOptionFrom(e.detail)}
	on:clickTo={(e) => setFilterOptionTo(e.detail)}
	on:addReaction={(e) => addReaction(e.detail.card, e.detail.emoji)}
	on:addCardDeletingSlot={(e) => addCardDeletingSlot(e.detail)}
	on:removeCardDeletingSlot={(e) => removeCardDeletingSlot(e.detail)}
/>

<h2>この画面のQRコード</h2>
<Qr url={$page.url.href} />

{#if data.currentUser?.uid}
	<NotificationPermission uid={data.currentUser.uid} />
{/if}
