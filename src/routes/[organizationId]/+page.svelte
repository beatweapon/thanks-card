<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { flip } from 'svelte/animate';
	import { cards, watchCardCollection } from '$lib/stores/card.js';
	import NotificationPermission from 'src/lib/components/NotificationPermission.svelte';
	import User from '$lib/components/User.svelte';
	import Card from '$lib/components/Card.svelte';

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
			.sort((a, b) => b.count - a.count);
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
			<li class="list">
				<User user={data} on:click={() => setFilterOptionFrom(data.id)} /> : {data.count}枚
			</li>
		{/each}
	</ol>
</div>

<h2>Thanks Cards</h2>

<ul class="cards">
	{#each filteredCards as card (card.id)}
		<li animate:flip={{ duration: 500 }}>
			<Card
				{card}
				bind:members={data.organization.members}
				on:clickFrom={() => setFilterOptionFrom(card.from)}
				on:clickTo={() => setFilterOptionTo(card.to)}
			/>
		</li>
	{/each}
</ul>

{#if data.currentUser?.uid}
	<NotificationPermission uid={data.currentUser.uid} />
{/if}

<style>
	ol {
		padding: 0;
	}

	.list {
		margin: 0.5rem;
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
</style>
