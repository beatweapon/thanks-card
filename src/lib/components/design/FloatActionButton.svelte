<button on:click>
  <span class="fab">
    <slot />
  </span>
</button>

<style>
  button {
    position: relative;
    width: 60px;
    height: 60px;
    display: block;
    text-align: center;
    margin: 0 10px;
    border-radius: 50%;
    border: none;
    padding: 6px;
    box-sizing: border-box;
    text-decoration: none;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
    background: linear-gradient(0deg, #ddd, #fff);
    transition: 0.5s;
  }

  button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    text-decoration: none;
  }

  button .fab {
    width: 100%;
    height: 100%;
    display: block;
    background: linear-gradient(0deg, #fff, #ddd);
    border-radius: 50%;
    line-height: calc(60px - 12px);
    font-size: 24px;
    color: #262626;
    transition: 0.5s;
  }

  button:hover .fab {
    color: #e4405f;
  }
</style>
