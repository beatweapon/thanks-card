<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: #0a3069;
    font-weight: bold;
    background: #ddf4ff right 0% no-repeat url('/images/card/11/flower_series_nemophila.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }

  .card_back_cover {
    background: right 0% no-repeat url('/images/card/11/flower_series_nemophila.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }
</style>
