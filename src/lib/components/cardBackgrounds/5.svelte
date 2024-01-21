<div class="card_back">
  <div class="grid">
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
    <div class="border_box" />
  </div>
  <div class="card_contents">
    <slot />
  </div>
</div>

<style>
  .card_back {
    color: revert;
    position: relative;
    font-weight: bold;
    color: white;

    background: #222;
  }

  .grid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

  @property --rotate {
    syntax: '<angle>';
    initial-value: 45deg;
    inherits: false;
  }

  .border_box:nth-child(3) {
    border-top: solid 0.2rem green;
    border-right: solid 0.2rem green;
    border-image-slice: 1;
    border-image-source: linear-gradient(var(--rotate), #743ad5, #fff, #d53a9d);
    animation: animateGradient 5s infinite linear;
  }

  .border_box:nth-child(7) {
    border-bottom: solid 0.2rem green;
    border-left: solid 0.2rem green;
    border-image-slice: 1;
    border-image-source: linear-gradient(var(--rotate), #743ad5, #fff, #d53a9d);
    animation: animateGradient 5s infinite linear;
  }

  @keyframes animateGradient {
    0% {
      --rotate: 0deg;
    }
    100% {
      --rotate: 360deg;
    }
  }

  .card_contents {
    position: relative;
    z-index: +1;
  }
</style>
