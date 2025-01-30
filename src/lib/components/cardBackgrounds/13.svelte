<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: black;
    font-weight: bold;
    background-image: url('/images/card/8/a_rabbit_and_a_turtle.webp');
    background-size: cover;
    background-position: center;
  }

  .card_back_cover {
    background-color: rgba(255, 255, 255, 0.85);
  }
</style>
