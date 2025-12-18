<script>
  import FadeInUp from 'src/lib/components/animation/FadeInUp.svelte';
  import CountUp from 'src/lib/components/animation/CountUp.svelte';
  import { onMount, tick } from 'svelte';

  /** @type {string} */
  export let title;

  /** @type {number} */
  export let count;

  /** @type {InstanceType<typeof FadeInUp>} */
  let fadeInTitle;

  /** @type {InstanceType<typeof FadeInUp>} */
  let fadeInCount;

  /** @type {InstanceType<typeof CountUp>} */
  let countUp;

  onMount(async () => {
    await tick();
    await fadeInTitle.play();
    await fadeInCount.play();
    await countUp.play();
  });
</script>

<FadeInUp bind:this={fadeInTitle}>
  <h2>{title}</h2>
</FadeInUp>

<FadeInUp bind:this={fadeInCount}>
  <p>
    <CountUp bind:this={countUp} to={count} /> 枚
  </p>
</FadeInUp>
