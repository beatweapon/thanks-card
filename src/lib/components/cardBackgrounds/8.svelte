<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: #772057;
    font-weight: bold;
    background: #ffeff7 right 0% no-repeat url('/images/card/8/flower_series_rose.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }

  .card_back_cover {
    background: right 0% no-repeat url('/images/card/8/flower_series_rose.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }
</style>
