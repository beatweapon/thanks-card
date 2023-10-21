<script>
	import ThanksCardList from '$lib/components/ThanksCardList.svelte';
	import { cards } from '$lib/stores/card';
</script>

<h1>Thanks Cards</h1>

<ThanksCardList bind:cards={$cards} />
