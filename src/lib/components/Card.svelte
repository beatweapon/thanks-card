<script>
  import PlainButton from '$lib/components/design/PlainButton.svelte';
  import User from '$lib/components/User.svelte';
  import { createEventDispatcher } from 'svelte';
  import * as designs from '$lib/components/cardBackgrounds';

  /**
   * @type {import('src/types/organization/card').ThanksCardPreview}
   */
  export let card;

  /** @type {import('src/types/organization/member').OrganizationMember[]} */
  export let members;

  $: to = members.find((m) => m.id === card.to) || { name: '素敵な誰か' };
  $: from = members.find((m) => m.id === card.from) || { name: '' };

  const createdAt = card.createdAt
    ? card.createdAt.toDate().toLocaleString('ja-JP')
    : new Date().toLocaleString('ja-JP');

  // イベントディスパッチャーを作成
  const dispatch = createEventDispatcher();

  const onClickFrom = () => {
    dispatch('clickFrom');
  };

  const onClickTo = () => {
    dispatch('clickTo');
  };

  $: componentName = () => {
    const designId = card.designId || 0;
    return `card_${designId}`;
  };

  /**
   * 動的に読み込まれたコンポーネントを保持する変数
   * @type {import('svelte').ComponentType | null}
   */
  $: dynamicComponent =
    designs[
      /** @type {keyof import("src/lib/components/cardBackgrounds/index")} */ (componentName())
    ];
</script>

{#if dynamicComponent}
  <div class="card">
    <svelte:component this={dynamicComponent}>
      <div class="card_inner">
        <div class="from-to">
          <PlainButton on:click={onClickFrom}>
            <User user={from} />
          </PlainButton>
          ->
          <PlainButton on:click={onClickTo}>
            <User user={to} />
          </PlainButton>
        </div>
        <div class="message">{card.message}</div>
        <div />
        <div class="time">{createdAt}</div>
        <slot />
      </div>
    </svelte:component>
  </div>
{/if}

<style>
  .card {
    margin: 1rem;

    --shadow: -0.5rem -0.5rem 1rem hsl(0 0% 100% / 0.75), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5);
    box-shadow: var(--shadow);
    outline: none;
    transition: all 0.1s;
  }

  .card_inner {
    padding: 1rem;
  }

  .from-to {
    display: flex;
    align-items: center;
  }

  .message {
    margin: 1rem 0;
    white-space: pre-wrap;
  }

  .time {
    text-align: end;
    font-size: 0.7rem;
  }
</style>
