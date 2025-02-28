<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: #4d2d00;
    font-weight: bold;
    background: #fff1e5 right 0% no-repeat url('/images/card/12/flower_series_dry-flower.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }

  .card_back_cover {
    background: right 0% no-repeat url('/images/card/12/flower_series_dry-flower.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }
</style>
