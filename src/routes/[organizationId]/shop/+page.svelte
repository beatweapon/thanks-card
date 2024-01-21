<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { stats } from '$lib/stores/memberStats';
	import FloatButton from 'src/lib/components/design/FloatButton.svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';

	let items = [{ src: '1.svg', price: 300 }];

	/** @type {boolean} */
	let processing = false;

	/**
	 * @param item {{src: string, price: number}}
	 */
	const buy = async (item) => {
		if (processing) return;

		await fetch(`${base}/api/organizations/${$page.params.organizationId}/shop`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				frame: item.src,
				price: item.price,
			}),
		});
	};

	const goToOrganizationPage = () => {
		goto(removeLastPathFromURL($page.url.toString()));
	};

	/**
	 * @param {string} url
	 */
	const removeLastPathFromURL = (url) => {
		// 正規表現でURLから最後のスラッシュとその後の文字列を削除
		return url.replace(/\/[^/]+$/, '');
	};
</script>

<div class="center">
	{#if $stats}
		<div>現在の所持ポイント:{$stats.point}</div>
		<ul class="shop_item_list">
			{#each items as item}
				<li class="item">
					<img src={`/images/userIconFrame/${item.src}`} alt="item" />
					<span>{item.price} point</span>
					{#if $stats.item?.frames?.find((src) => src === item.src)}
						<span>購入済み</span>
					{:else if item.price > $stats.point}
						<span>ポイント不足</span>
					{:else}
						<FloatButton disabled={item.price > $stats.point} on:click={() => buy(item)}
							>購入する</FloatButton
						>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
	<PlainButton on:click={goToOrganizationPage}>戻る</PlainButton>
</div>

<style>
	.center {
		height: calc(100dvh - 40px);
		margin: 0 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.shop_item_list {
		display: grid;
	}
</style>
