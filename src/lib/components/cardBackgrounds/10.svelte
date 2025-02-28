<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: #4d2d00;
    font-weight: bold;
    background: #fff8c5 right 0% no-repeat url('/images/card/10/flower_series_sun-flower.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }

  .card_back_cover {
    background: right 0% no-repeat url('/images/card/10/flower_series_sun-flower.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }
</style>
