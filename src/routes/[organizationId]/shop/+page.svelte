<script>
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { stats } from '$lib/stores/memberStats';
  import FloatButton from '$lib/components/design/FloatButton.svelte';
  import PlainButton from '$lib/components/design/PlainButton.svelte';
  import * as backgrounds from '$lib/components/cardBackgrounds';

  let frames = [
    { frame: '1.svg', price: 300 },
    { frame: '2.svg', price: 300 },
    { frame: '3.svg', price: 300 },
    { frame: '4.svg', price: 500 },
    { frame: '5.svg', price: 1000 },
  ];

  let cardItems = [
    { designId: 'shop_1', price: 1000 },
    { designId: 'shop_2', price: 1000 },
    { designId: 'shop_3', price: 1000 },
    { designId: 'shop_4', price: 1000 },
  ];

  /**
   * @type {Array<{
   *  designId: string,
   *  price: number,
   * 	component: import('svelte').ComponentType,
   * }>}
   */
  let cardDesigns = [];

  cardItems.forEach((item) => {
    const componentName = /** @type {keyof import("src/lib/components/cardBackgrounds/index")} */ (
      `card_${item.designId}`
    );

    const data = {
      designId: item.designId,
      price: item.price,
      component: backgrounds[componentName],
    };

    cardDesigns = [...cardDesigns, data];
  });

  /** @type {boolean} */
  let processing = false;

  /**
   * @param item {{frame?: string, card?: string, price: number}}
   */
  const buy = async (item) => {
    if (processing) return;

    await fetch(`${base}/api/organizations/${$page.params.organizationId}/shop`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(item),
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
      {#each frames as item}
        <li class="item">
          <img src={`/images/userIconFrame/${item.frame}`} alt="item" />
          <span>{item.price} point</span>
          {#if $stats.item?.frames?.find((frame) => frame === item.frame)}
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

    <ul class="card_item_list">
      {#each cardDesigns as item}
        <li class="item">
          <div class="card_wrapper">
            <svelte:component this={item.component}>
              <div class="card_inner">Thanks!</div>
            </svelte:component>
          </div>
          <span>{item.price} point</span>
          {#if $stats.item?.cards?.find((card) => card === item.designId)}
            <span>購入済み</span>
          {:else if item.price > $stats.point}
            <span>ポイント不足</span>
          {:else}
            <FloatButton
              disabled={item.price > $stats.point}
              on:click={() => buy({ card: item.designId, price: item.price })}>購入する</FloatButton
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

  .card_item_list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 1rem;
  }

  .card_wrapper {
    --shadow: -0.5rem -0.5rem 1rem hsl(0 0% 100% / 0.75), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5);
    box-shadow: var(--shadow);
    outline: none;
    transition: all 0.1s;
  }

  .card_inner {
    height: 10rem;
    display: grid;
    justify-content: center;
    align-items: center;
  }
</style>
