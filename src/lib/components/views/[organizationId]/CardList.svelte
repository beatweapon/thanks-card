<script>
  import { createEventDispatcher } from 'svelte';
  import { send, receive } from '$lib/animations/transition.js';
  import { flip } from 'svelte/animate';
  import Card from '$lib/components/Card.svelte';
  import ReactionEditor from 'src/lib/components/views/[organizationId]/ReactionEditor.svelte';

  /** @type {import('src/types/user').User} */
  export let currentUser;

  /** @type {import('src/types/organization/card').ThanksCard[]} */
  export let cards;

  /** @type {import('src/types/organization/member').OrganizationMember[]} */
  export let members;

  /** @type {Object<string, NodeJS.Timeout>} */
  export let cardDeletingSlot = {};

  /** @type {boolean} */
  export let showsMenu = false;

  const dispatch = createEventDispatcher();
</script>

<ul class="cards">
  {#each cards.sort((a, b) => {
    if (a.createdAt.toDate() < b.createdAt.toDate()) return 1;
    if (a.createdAt.toDate() > b.createdAt.toDate()) return -1;
    return 0;
  }) as card (card.id)}
    <li
      class="card_wrap"
      class:deleting={cardDeletingSlot[card.id] !== undefined}
      in:receive={{ key: card.id }}
      out:send={{ key: card.id }}
      animate:flip={{ duration: 200 }}
    >
      <Card
        {card}
        {members}
        on:clickFrom={() => dispatch('clickFrom', card.from)}
        on:clickTo={() => dispatch('clickTo', card.to)}
      >
        <div class="reaction_area">
          {#if card.reactions}
            <span class="reaction">{card.reactions[0].emoji}</span>
          {:else if card.to === currentUser.uid}
            <ReactionEditor
              {card}
              on:clickEmoji={(e) =>
                dispatch('addReaction', { card: e.detail.card, emoji: e.detail.emoji })}
            />
          {/if}
        </div>
      </Card>
      {#if showsMenu && card.from === currentUser.uid}
        {#if !cardDeletingSlot[card.id]}
          <button
            on:click={() => {
              dispatch('addCardDeletingSlot', card.id);
            }}>削除</button
          >
        {:else if cardDeletingSlot[card.id]}
          <button
            on:click={() => {
              dispatch('removeCardDeletingSlot', card.id);
            }}>やっぱりやめる</button
          >
        {/if}
      {/if}
    </li>
  {/each}
  {#if cards.length < 5}
    <li />
    <li />
    <li />
    <li />
    <li />
  {/if}
</ul>

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 1rem;
  }

  .card_wrap {
    opacity: 1;
  }

  .card_wrap.deleting {
    /* カードの表示非表示のアニメーションとぶつかるため削除の見た目を優先 */
    opacity: 0 !important;
    transition: all 5s;
  }

  .reaction_area {
    display: flex;
    justify-content: end;
    position: relative;
  }

  .reaction {
    -webkit-text-fill-color: initial;
  }
</style>
