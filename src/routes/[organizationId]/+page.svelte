<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { send, receive } from '$lib/animations/transition.js';
	import { flip } from 'svelte/animate';
	import { cards, watchCardCollection } from '$lib/stores/card.js';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import NotificationPermission from '$lib/components/NotificationPermission.svelte';
	import User from '$lib/components/User.svelte';
	import Card from '$lib/components/Card.svelte';
	import Qr from '$lib/components/Qr.svelte';

	export let data;

	watchCardCollection($page.params.organizationId);

	$: sendRanking = () => {
		/**
		 * カウントを格納するオブジェクト
		 * @type {Object.<string, number>}
		 */
		const counts = {};

		$cards.forEach((c) => {
			if (counts[c.from]) {
				counts[c.from]++;
			} else {
				counts[c.from] = 1;
			}
		});

		return Object.entries(counts)
			.map(([id, count]) => {
				const member = data.organization.members?.find((m) => m.id === id);
				return {
					id: member?.id || '',
					name: member?.name || '優しい誰か',
					picture: member?.picture,
					count,
				};
			})
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	};

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
</script>

<h2>Welcome to TopPage</h2>
<button on:click={() => goto(`${$page.url}/thanksCardEditor`)}>カードを送る</button>

<h2>Send Ranking</h2>
<div class="ranking">
	<ol>
		{#each sendRanking() as data}
			<li class="list_item">
				<PlainButton on:click={() => setFilterOptionFrom(data.id)}>
					<span class="list_item_inner">
						<User user={data} /> : {data.count}枚
					</span>
				</PlainButton>
			</li>
		{/each}
	</ol>
</div>

<h2>Thanks Cards</h2>

<ul class="cards">
	{#each filteredCards as card (card.id)}
		<li
			class="card_wrap"
			in:receive={{ key: card.id }}
			out:send={{ key: card.id }}
			animate:flip={{ duration: 200 }}
		>
			<Card
				{card}
				bind:members={data.organization.members}
				on:clickFrom={() => setFilterOptionFrom(card.from)}
				on:clickTo={() => setFilterOptionTo(card.to)}
			/>
		</li>
	{/each}
</ul>

<h2>この画面のQRコード</h2>
<Qr url={$page.url.href} />

{#if data.currentUser?.uid}
	<NotificationPermission uid={data.currentUser.uid} />
{/if}

<style>
	ol {
		padding: 0;
	}

	.list_item {
		display: block;
		margin: 0.5rem;
	}

	.list_item_inner {
		display: flex;
		align-items: center;
	}

	.cards {
		display: flex;
		flex-wrap: wrap;
		max-width: 90%;

		list-style: none;
		padding: 0;
	}

	.card_wrap {
		max-width: 100%;
		width: 400px;
	}
</style>
