<script>
	/**
	 * @type {import('src/lib/stores/card').Card}
	 */
	export let card;
</script>

<div class="card">
	<div>from: {card.from}</div>
	<div>{card.message}</div>
	<div>{card.created}</div>
</div>

<style>
	.card {
		margin: 1rem;
		padding: 1rem;
		border: 1px solid #333;
	}
</style>
