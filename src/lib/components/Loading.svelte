<div class="loading">
	<div class="dot" />
	<div class="dot" />
	<div class="dot" />
	<div class="dot" />
	<div class="dot" />
</div>

<style>
	.loading {
		display: flex;
	}

	.dot {
		width: 2rem;
		height: 2rem;
		margin: 0.8rem;
		border-radius: 50%;
	}

	.dot:nth-child(1) {
		background: hsl(calc(45 * 0) 100% 75%);
		animation: wave 2s ease-out infinite;
		animation-delay: calc(0.2s * 0);
	}

	.dot:nth-child(2) {
		background: hsl(calc(45 * 1) 100% 75%);
		animation: wave 2s ease-out infinite;
		animation-delay: calc(0.2s * 1);
	}

	.dot:nth-child(3) {
		background: hsl(calc(45 * 2) 100% 75%);
		animation: wave 2s ease-out infinite;
		animation-delay: calc(0.2s * 2);
	}

	.dot:nth-child(4) {
		background: hsl(calc(45 * 3) 100% 75%);
		animation: wave 2s ease-out infinite;
		animation-delay: calc(0.2s * 3);
	}

	.dot:nth-child(5) {
		background: hsl(calc(45 * 4) 100% 75%);
		animation: wave 2s ease-out infinite;
		animation-delay: calc(0.2s * 4);
	}

	@keyframes wave {
		0% {
			opacity: 0;
			transform: translateY(-5rem);
		}

		50%,
		75% {
			transform: translateY(0);
		}

		80%,
		100% {
			opacity: 1;
		}
	}
</style>
