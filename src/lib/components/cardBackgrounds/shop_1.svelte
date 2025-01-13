<div class="card_back">
  <slot />
</div>

<style>
  .card_back {
    font-family: 'Sacramento', sans-serif;
    background-color: #010a01;
    color: #fff;
    /* animation: pulsate 1.5s infinite alternate; */
    text-shadow:
      0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #bc13fe,
      0 0 82px #bc13fe,
      0 0 92px #bc13fe,
      0 0 102px #bc13fe,
      0 0 151px #bc13fe;
  }

  @keyframes pulsate {
    100% {
      text-shadow:
        0 0 4px #fff,
        0 0 11px #fff,
        0 0 19px #fff,
        0 0 40px #bc13fe,
        0 0 80px #bc13fe,
        0 0 90px #bc13fe,
        0 0 100px #bc13fe,
        0 0 150px #bc13fe;
    }

    0% {
      text-shadow:
        0 0 2px #fff,
        0 0 4px #fff,
        0 0 6px #fff,
        0 0 10px #bc13fe,
        0 0 45px #bc13fe,
        0 0 55px #bc13fe,
        0 0 70px #bc13fe,
        0 0 80px #bc13fe;
    }
  }
</style>
