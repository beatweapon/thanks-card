<script>
	import Card from './Card.svelte';

	/**
	 * @type {import('$lib/stores/card').Card[]}
	 */
	export let cards;
</script>

<div class="cards">
	{#each cards as card}
		<Card {card} />
	{/each}
</div>

<style>
	.cards {
		display: flex;
	}
</style>
