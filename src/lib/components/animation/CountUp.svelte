<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  export let to = 0;
  export let duration = 500;

  const value = tweened(0);

  export const play = () => {
    value.set(0);
    return value.set(to, { duration, easing: cubicOut });
  };
</script>

<span>{$value.toFixed(0)}</span>
