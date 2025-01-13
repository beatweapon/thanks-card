<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: #772057;
    font-weight: bold;
    background: #ffeff7 right 0% no-repeat url('/images/card/10/flower_series_rose.svg');
    background-size: 30%;
    transform: rotate(180deg);
  }

  .card_back_cover {
    background: right 0% no-repeat url('/images/card/10/flower_series_rose.svg');
    background-size: 30%;
    transform: rotate(180deg);
  }
</style>
