<div class="card_back">
  <div class="card_back_cover">
    <div class="card_contents">
      <slot />
    </div>
  </div>
</div>

<style>
  .card_back {
    color: white;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    background-image: url('/images/card/noise.jpg');
    background-size: 20rem;
    background-repeat: repeat;
  }

  .card_back_cover {
    background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9));
  }

  .card_contents {
    position: relative;
    z-index: +1;
    background-image: linear-gradient(-15deg, rgba(0, 10, 194, 0.7), rgba(37, 227, 211, 0.3));
  }
</style>
