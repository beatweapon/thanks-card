<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import User from '$lib/components/User.svelte';
	import Card from '$lib/components/Card.svelte';

	export let data;

	$: sendRanking = () => {
		/**
		 * カウントを格納するオブジェクト
		 * @type {Object.<string, number>}
		 */
		const counts = {};

		data.cards.forEach((c) => {
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
					name: member?.name || '優しい誰か',
					picture: member?.picture,
					count,
				};
			})
			.sort((a, b) => b.count - a.count);
	};
</script>

<h2>Welcome to TopPage</h2>
<button on:click={() => goto(`${$page.url}/thanksCardEditor`)}>カードを送る</button>

<h2>Send Ranking</h2>
<div class="ranking">
	<ol>
		{#each sendRanking() as data}
			<li class="list"><User user={data} /> : {data.count}枚</li>
		{/each}
	</ol>
</div>

<h2>Thanks Cards</h2>
<div class="cards">
	{#each data.cards as card}
		<Card {card} bind:members={data.organization.members} />
	{/each}
</div>

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
	}
</style>
