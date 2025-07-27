<div class="card_back">
  <span class="character">
    <slot />
  </span>
</div>

<style>
  .card_back {
    font-family: 'Sacramento', sans-serif;
    background-color: #010a01;
  }

  .character {
    color: #fff;
    text-shadow:
      0 0 10px #bc13fe,
      0 0 20px #bc13fe,
      0 0 40px #bc13fe;
  }
</style>
