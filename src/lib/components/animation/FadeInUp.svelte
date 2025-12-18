<script>
  import { tick } from 'svelte';

  export let duration = 300;
  export let distance = 100;

  let visible = false;

  /** @type {HTMLDivElement} */
  let el;

  const nextFrame = () => new Promise(requestAnimationFrame);

  /** @returns {Promise<void>} */
  export const play = async () => {
    visible = false;
    await tick(); // 初期状態を確定
    await nextFrame();

    return new Promise(async (resolve) => {
      /** @type {(e: TransitionEvent) => void} */
      const onEnd = (e) => {
        // transform / opacity のどちらか1回で十分
        if (e.target === el) {
          el.removeEventListener('transitionend', onEnd);
          resolve();
        }
      };

      el.addEventListener('transitionend', onEnd, { once: true });
      visible = true;
    });
  };
</script>

<div
  bind:this={el}
  class="fade-in-up"
  class:visible
  style="
    --duration: {duration}ms;
    --distance: {distance}px;
  "
>
  <slot />
</div>

<style>
  .fade-in-up {
    opacity: 0;
    transform: translateY(var(--distance));
    transition:
      opacity var(--duration) ease-in,
      transform var(--duration) ease-out;
  }

  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
