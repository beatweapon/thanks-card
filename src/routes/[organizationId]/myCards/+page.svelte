<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { members, watchMemberCollection } from '$lib/stores/members.js';
	import { cards, watchCardCollection } from '$lib/stores/cardOwn.js';
	import CardList from 'src/lib/components/views/[organizationId]/CardList.svelte';
	import FloatButton from 'src/lib/components/design/FloatButton.svelte';

	export let data;

	let isShowSendCardList = false;

	const toggleShowCardList = () => {
		isShowSendCardList = !isShowSendCardList;
	};

	watchMemberCollection($page.params.organizationId);

	watchCardCollection($page.params.organizationId, data.currentUser.uid);

	const filterOption = { from: '', to: '' };

	$: filteredCards = $cards.filter(cardFilter).filter((c) => {
		if (isShowSendCardList) {
			return c.from === data.currentUser.uid;
		} else {
			return c.to === data.currentUser.uid;
		}
	});

	/**
	 * カスタムイベントを処理する関数
	 *
	 * @param {string} uid - カスタムイベントオブジェクト
	 * @returns {void}
	 */
	const setFilterOptionFrom = (uid) => {
		filterOption.to = '';
		filterOption.from = filterOption.from !== uid ? uid : '';

		cardFilter = (card) => !filterOption.from || card.from === filterOption.from;
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

		cardFilter = (card) => !filterOption.to || card.to === filterOption.to;
	};

	/**
	 *
	 * @param {import('src/types/organization/card').ThanksCard} card
	 */
	let cardFilter = (card) => true;
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

<FloatButton on:click={toggleShowCardList}>
	{#if isShowSendCardList}
		受け取ったカード
	{:else}
		贈ったカード
	{/if}
</FloatButton>

<CardList
	currentUser={data.currentUser}
	cards={filteredCards}
	members={$members}
	{cardDeletingSlot}
	showsMenu={true}
	on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
	on:clickFrom={(e) => setFilterOptionFrom(e.detail)}
	on:clickTo={(e) => setFilterOptionTo(e.detail)}
	on:addReaction={(e) => addReaction(e.detail.card, e.detail.emoji)}
	on:addCardDeletingSlot={(e) => addCardDeletingSlot(e.detail)}
	on:removeCardDeletingSlot={(e) => removeCardDeletingSlot(e.detail)}
/>
