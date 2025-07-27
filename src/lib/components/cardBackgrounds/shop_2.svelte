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
      0 0 10px #1cff14,
      0 0 20px #1cff14,
      0 0 40px #1cff14;
  }
</style>
