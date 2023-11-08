<div class="card_back">
	<div class="text">
		<slot />
	</div>
</div>

<style>
	.card_back {
		background-color: white;
	}

	.text {
		font-weight: bold;
		--color1: #edb658;
		--color2: #e7719b;
		background: linear-gradient(45deg, var(--color1), var(--color2));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
