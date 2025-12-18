<script>
  import FadeInUp from 'src/lib/components/animation/FadeInUp.svelte';
  import Typewriter from 'src/lib/components/animation/Typewriter.svelte';
  import { onMount, tick } from 'svelte';

  /** @type {number} */
  export let year;

  /** @type {InstanceType<typeof FadeInUp>} */
  let fadeIn;

  /** @type {InstanceType<typeof Typewriter>} */
  let introductionText;

  onMount(async () => {
    await tick();
    await fadeIn.play();
    await introductionText.play();
  });
</script>

<FadeInUp bind:this={fadeIn}>
  <h2>Thanks {year} !</h2>

  <p>
    <Typewriter bind:this={introductionText} text={`${year}年の感謝を振り返りましょう！`} />
  </p>
</FadeInUp>
