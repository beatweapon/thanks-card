<script>
	/** @type {string | undefined} */
	export let src;
</script>

<img src={src || '/images/default.jpg'} alt="user-icon" class="user-icon" />

<style>
	.user-icon {
		width: 2rem;
		border-radius: 50%;
	}
</style>
