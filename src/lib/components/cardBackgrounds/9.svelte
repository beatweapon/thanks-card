<div class="card_back">
  <div class="card_back_cover">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: #003d16;
    font-weight: bold;
    background: #dafbe1 right 0% no-repeat url('/images/card/9/flower_series_leaf.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }

  .card_back_cover {
    background: right 0% no-repeat url('/images/card/9/flower_series_leaf.svg');
    background-size: 20%;
    transform: rotate(180deg);
  }
</style>
