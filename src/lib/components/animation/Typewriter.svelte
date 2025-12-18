<script>
  import { tick } from 'svelte';

  export let text = '';
  export let speed = 10; // ms / character

  let output = '';

  export const play = async () => {
    output = '';
    await tick(); // DOM 初期化待ち

    for (const char of text) {
      output += char;
      await new Promise((r) => setTimeout(r, speed));
    }
  };
</script>

<span>{output}</span>

<style>
  span {
    white-space: pre-wrap;
  }
</style>
