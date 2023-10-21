<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>

<h1>Welcome to TopPage</h1>
<button on:click={() => goto(`${$page.url}/thanksCards`)}>カード一覧</button>
<button on:click={() => goto(`${$page.url}/thanksCardEditor`)}>カードを送る</button>
