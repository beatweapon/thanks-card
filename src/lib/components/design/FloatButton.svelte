<script>
  export let disabled = false;
</script>

<button class="button b-green rot-135" {disabled} on:click>
  <slot />
</button>

<style>
  .button {
    display: inline-block;
    font-size: 1rem;
    font-weight: bold;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.2rem;
    border: none;
    transition: all 0.5s;
    filter: hue-rotate(0deg);
    color: #fff;
    text-decoration: none;
  }

  .b-green,
  .b-green:before {
    background: rgba(73, 155, 234, 1);
    background: -webkit-linear-gradient(
      45deg,
      rgba(73, 155, 234, 1) 0%,
      rgba(26, 188, 156, 1) 100%
    );
    background: linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  }

  .rot-135:hover {
    filter: hue-rotate(135deg);
  }
</style>
