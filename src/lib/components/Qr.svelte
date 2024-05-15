<script>
  /** @type {string} */
  export let url;

  /** @type {number} */
  export let width = 130;

  /** @type {number} */
  export let height = 130;
</script>

<img
  src={`https://api.qrserver.com/v1/create-qr-code/?size=${width}x${height}&data=${url}`}
  alt="qr"
/>
