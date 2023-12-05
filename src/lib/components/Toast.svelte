<script>
	export let show = false;
</script>

<div class="toast" class:show>
	<slot />
</div>

<style>
	.toast {
		position: fixed;
		z-index: +1000;
		top: 1rem;
		left: 50%;
		transform: translate(-50%, calc(-100% + -2rem));
		border-radius: 1rem;
		border: solid 0.3rem rgb(255, 196, 125);
		max-width: 90%;
		min-width: 20rem;
		text-align: center;
		padding: 0.5rem;
		background-color: bisque;
		transition: all 0.5s ease-in-out;
	}

	.show {
		transform: translate(-50%, 0%);
	}
</style>
