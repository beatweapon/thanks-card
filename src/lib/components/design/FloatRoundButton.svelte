<button on:click>
  <slot />
</button>

<style>
  button {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 1rem;
    background: none;
    font: inherit;
    cursor: pointer;
    color: inherit;

    --shadow: -0.1rem -0.1rem 1rem hsl(0 0% 100% / 0.75), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5);
    box-shadow: var(--shadow);
    outline: none;
    transition: all 0.1s;

    &:hover,
    &:focus-visible {
      scale: 1.1;
    }
  }
</style>
