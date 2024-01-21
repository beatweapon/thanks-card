<div class="card_back">
  <div class="text">
    <slot />
  </div>

  <div class="area">
    <ul class="circles">
      {#each { length: 10 } as _}
        <li>
          <span />
          <span />
          <span />
          <span />
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .card_back {
    position: relative;
  }

  .text {
    font-weight: bold;
    color: hsl(0, 0%, 100%);
    position: relative;
    z-index: 1;
  }

  .area {
    position: absolute;
    top: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(52, 52, 66, 1) 35%,
      rgba(0, 0, 0, 1) 100%
    );
    width: 100%;
    height: 100%;
  }

  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .circles li {
    position: absolute;
    top: -2rem;
    list-style: none;
    animation:
      fall 15s linear infinite,
      spin 1s linear infinite;
    animation-name: fall, spin;
    width: 0.5rem;
    height: 2rem;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-around;
    align-items: center;
  }

  .circles li span {
    display: block;
    background: rgba(255, 255, 124, 0.5);
    transform: rotate(45deg);
  }

  .circles li span:nth-child(1) {
    width: 0.4rem;
    height: 0.4rem;
  }

  .circles li span:nth-child(2) {
    width: 0.2rem;
    height: 0.2rem;
  }

  .circles li span:nth-child(3) {
    width: 0.1rem;
    height: 0.1rem;
  }

  .circles li span:nth-child(4) {
    width: 0.1rem;
    height: 0.1rem;
  }

  .circles li:nth-child(1) {
    left: 25%;
    animation-delay: 0s;
    animation-duration: 8s, 1s;
  }

  .circles li:nth-child(2) {
    left: 10%;
    animation-delay: 2s;
    animation-duration: 12s, 0.5s;
  }

  .circles li:nth-child(3) {
    left: 70%;
    animation-delay: 4s, 0.5s;
    animation-duration: 6s, 1.5s;
  }

  .circles li:nth-child(4) {
    left: 40%;
    animation-delay: 0s;
    animation-duration: 18s, 0.7s;
  }

  .circles li:nth-child(5) {
    left: 65%;
    animation-delay: 0s;
    animation-duration: 25s, 0.8s;
  }

  .circles li:nth-child(6) {
    left: 75%;
    animation-delay: 3s;
  }

  .circles li:nth-child(7) {
    left: 35%;
    animation-delay: 7s;
  }

  .circles li:nth-child(8) {
    left: 50%;
    animation-delay: 15s;
    animation-duration: 18s, 0.5s;
  }

  .circles li:nth-child(9) {
    left: 20%;
    animation-delay: 2s;
    animation-duration: 35s, 0.5s;
  }

  .circles li:nth-child(10) {
    left: 85%;
    animation-delay: 0s;
    animation-duration: 11s, 0.5s;
  }

  @keyframes fall {
    0% {
      top: -100%;
      opacity: 1;
    }

    100% {
      top: 150%;
      opacity: 0;
    }
  }

  @keyframes spin {
    0% {
      transform: rotatey(0deg);
      opacity: 0.75;
    }

    50% {
      transform: rotatey(60deg);
    }

    100% {
      transform: rotatey(0deg);
      opacity: 1;
    }
  }
</style>
