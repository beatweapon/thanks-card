<script>
  import FloatRoundButton from 'src/lib/components/design/FloatRoundButton.svelte';
  import PlainButton from 'src/lib/components/design/PlainButton.svelte';
  import { createEventDispatcher } from 'svelte';

  /** @type {import('src/types/organization/card').ThanksCard} */
  export let card;

  const emojis = ['👍', '✌', '🙌', '⭐', '❤️', '😊', '😳', '🥳', '🍺', '🔥', '🍄'];

  let isOpenReactionUI = false;

  const toggleReactionUI = () => {
    isOpenReactionUI = !isOpenReactionUI;
  };

  const dispatch = createEventDispatcher();
</script>

<div class="reaction_editor">
  <FloatRoundButton on:click={toggleReactionUI}>
    {#if card.reactions}
      <span class="reaction">{card.reactions[0].emoji}</span>
    {:else}
      <span class="reaction">➕</span>
    {/if}
  </FloatRoundButton>
  {#if isOpenReactionUI}
    <ul class="emoji_list">
      {#each emojis as emoji}
        <li>
          <PlainButton
            on:click={() => {
              toggleReactionUI();
              dispatch('clickEmoji', { card: card, emoji });
            }}>{emoji}</PlainButton
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .reaction_editor {
    -webkit-text-fill-color: initial;
  }

  .reaction {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
  }

  .emoji_list {
    font-size: 1.5rem;
    position: absolute;
    top: 2rem;
    right: 0;
    padding: 0.25rem;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.5rem;
    background-color: #e5e9f4;

    --shadow: -0.1rem -0.1rem 1rem hsl(0 0% 100% / 0.75), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5);
    box-shadow: var(--shadow);
    outline: none;
  }
</style>
