<script>
  /** @type {string | undefined} */
  export let src;

  /** @type {string | undefined} */
  export let frameSrc = '';
</script>

<div class="user_icon_area">
  <img src={src || '/images/default.jpg'} alt="user-icon" class="user_icon" />
  {#if frameSrc}
    <img src={`/images/userIconFrame/${frameSrc}`} alt="user-icon-frame" class="user_icon_frame" />
  {/if}
</div>

<style>
  .user_icon_area {
    width: 2rem;
    height: 2rem;
    position: relative;
  }

  .user_icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    border-radius: 50%;
  }

  .user_icon_frame {
    width: 125%;
    height: 125%;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    border-radius: 50%;
  }
</style>
