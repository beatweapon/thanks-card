<script>
  import { onMount, tick } from 'svelte';
  import FadeInUp from 'src/lib/components/animation/FadeInUp.svelte';
  import CountUp from 'src/lib/components/animation/CountUp.svelte';

  /** @type {string} */
  export let title;

  /** @type {{emoji: string, count: number}[]} */
  export let emojis;

  /** @type {InstanceType<typeof FadeInUp>} */
  let fadeInTitle;

  /** @type {InstanceType<typeof FadeInUp>[]} */
  let fadeIns = [];

  /** @type {InstanceType<typeof CountUp>[]} */
  let counters = [];

  export const play = async () => {
    await tick();
    await fadeInTitle.play();
    for (const fadeIn of fadeIns) {
      if (fadeIn) {
        await fadeIn.play();
      }
    }
    for (const counter of counters) {
      if (counter) {
        await counter.play();
      }
    }
  };

  onMount(async () => {
    await tick();
    await play();
  });
</script>

<FadeInUp bind:this={fadeInTitle}>
  <h2>{title}</h2>
</FadeInUp>
{#if emojis && emojis.length}
  <ol>
    {#each emojis as e, i}
      <FadeInUp bind:this={fadeIns[i]}>
        <li>
          {e.emoji} —
          <CountUp to={e.count} bind:this={counters[i]} />
        </li>
      </FadeInUp>
    {/each}
  </ol>
{:else}
  <p>なし</p>
{/if}
