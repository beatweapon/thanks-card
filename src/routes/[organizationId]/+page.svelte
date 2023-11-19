<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { members, watchMemberCollection } from '$lib/stores/members.js';
	import Loading from 'src/lib/components/Loading.svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import NotificationPermission from '$lib/components/NotificationPermission.svelte';
	import Qr from '$lib/components/Qr.svelte';
	import In7DaysCards from 'src/lib/components/views/[organizationId]/In7DaysCards.svelte';
	import AllCards from 'src/lib/components/views/[organizationId]/AllCards.svelte';

	export let data;

	let isShowAllCardList = false;

	const toggleShowCardList = () => {
		isShowAllCardList = !isShowAllCardList;
	};

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

	// 通知の許可ステータスを追跡するための変数
	let permissionStatus = '';

	onMount(async () => {
		permissionStatus = Notification.permission;
	});
</script>

{#if permissionStatus === ''}
	<div class="center">
		<Loading />
	</div>
{:else if permissionStatus === 'default'}
	<div class="center">
		<div>
			<p>
				あなたにカードが届いたときや、あなたが贈ったカードにリアクションがついたときに通知を受け取ることができます。
			</p>
			<NotificationPermission uid={data.currentUser.uid} />

			<PlainButton on:click={() => (permissionStatus = 'skip')}>スキップ</PlainButton>
		</div>
	</div>
{:else}
	<h2>Welcome to TopPage</h2>
	<button on:click={() => goto(`${$page.url}/thanksCardEditor`)}>カードを送る</button>
	<a href={`${$page.url}/profile`}>名前を変更する</a>

	<button on:click={toggleShowCardList}>
		{#if isShowAllCardList}
			直近7日
		{:else}
			全て
		{/if}
	</button>

	{#if isShowAllCardList}
		<AllCards
			organizationId={$page.params.organizationId}
			currentUser={data.currentUser}
			members={$members}
			{cardFilter}
			{cardDeletingSlot}
			on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
			on:clickFrom={(e) => setFilterOptionFrom(e.detail)}
			on:clickTo={(e) => setFilterOptionTo(e.detail)}
			on:addReaction={(e) => addReaction(e.detail.card, e.detail.emoji)}
			on:addCardDeletingSlot={(e) => addCardDeletingSlot(e.detail)}
			on:removeCardDeletingSlot={(e) => removeCardDeletingSlot(e.detail)}
		/>
	{:else}
		<In7DaysCards
			organizationId={$page.params.organizationId}
			currentUser={data.currentUser}
			members={$members}
			{cardFilter}
			{cardDeletingSlot}
			on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
			on:clickFrom={(e) => setFilterOptionFrom(e.detail)}
			on:clickTo={(e) => setFilterOptionTo(e.detail)}
			on:addReaction={(e) => addReaction(e.detail.card, e.detail.emoji)}
			on:addCardDeletingSlot={(e) => addCardDeletingSlot(e.detail)}
			on:removeCardDeletingSlot={(e) => removeCardDeletingSlot(e.detail)}
		/>
	{/if}

	<h2>この画面のQRコード</h2>
	<Qr url={$page.url.href} />

	{#if data.currentUser?.uid}
		<NotificationPermission uid={data.currentUser.uid} />
	{/if}
{/if}

<style>
	.center {
		margin: 0 1rem;
		height: calc(100dvh - 2rem);
		display: grid;
		justify-content: center;
		align-items: center;
	}
</style>
