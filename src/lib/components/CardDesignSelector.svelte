<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';

	/** @type {string} */
	export let selectedDesignId = '0';

	const designIds = ['0', '1', '2', '3', '4', '5'];

	/**
	 * 動的に読み込まれたコンポーネントを保持する変数
	 * @type {Array<{
	 *  designId: string,
	 * 	component: import('svelte').ComponentType,
	 * }>}
	 */
	let designs = [];

	onMount(() => {
		designIds.forEach(async (designId) => {
			const module = await import(`$lib/components/cardBackgrounds/${designId}.svelte`);
			const component = module.default;
			designs = [...designs, { designId, component }];
		});
	});

	const dispatch = createEventDispatcher();

	/**
	 * @param {string} designId
	 */
	const onClick = (designId) => {
		dispatch('click', { designId });
	};
</script>

<div class="cards">
	{#each designs as design}
		<PlainButton on:click={() => onClick(design.designId)}>
			<div class="card_wrapper" class:selected={selectedDesignId === design.designId}>
				<svelte:component this={design.component}>
					<div class="card_inner">Thanks!</div>
				</svelte:component>
			</div>
		</PlainButton>
	{/each}
</div>

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		gap: 1rem;
	}

	.card_wrapper {
		--shadow: -0.5rem -0.5rem 1rem hsl(0 0% 100% / 0.75), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5);
		box-shadow: var(--shadow);
		outline: none;
		transition: all 0.1s;
	}

	.card_wrapper.selected {
		scale: 1.1;
	}

	.card_inner {
		height: 10rem;
		display: grid;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 430px) {
		.cards {
			grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
		}

		.card_inner {
			height: 2rem;
			display: grid;
			justify-content: center;
			align-items: center;
		}
	}
</style>
