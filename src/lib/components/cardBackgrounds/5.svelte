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
		position: relative;
		background-color: azure;
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

	.border_box:nth-child(3) {
		border-top: solid 0.2rem green;
		border-right: solid 0.2rem green;
	}

	.border_box:nth-child(7) {
		border-bottom: solid 0.2rem green;
		border-left: solid 0.2rem green;
	}

	.card_contents {
		/* padding: 1rem; */
	}
</style>
