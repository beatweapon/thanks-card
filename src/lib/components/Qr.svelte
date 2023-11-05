<script>
	/** @type {string} */
	export let url;

	/** @type {number} */
	export let width = 130;

	/** @type {number} */
	export let height = 130;
</script>

<img
	src={`https://chart.apis.google.com/chart?cht=qr&chs=${width}x${height}&chl=${url}`}
	alt="qr"
/>
