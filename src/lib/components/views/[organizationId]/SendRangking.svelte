<script>
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	import User from '$lib/components/User.svelte';
	import { createEventDispatcher } from 'svelte';

	/** @type {import('src/types/organization/card').ThanksCard[]} */
	export let cards;

	/** @type {import('src/types/organization/member').OrganizationMember[]} */
	export let members;

	$: rankingBySendCount = () => {
		/**
		 * カウントを格納するオブジェクト
		 * @type {Object.<string, number>}
		 */
		const counts = {};

		cards.forEach((c) => {
			if (counts[c.from]) {
				counts[c.from]++;
			} else {
				counts[c.from] = 1;
			}
		});

		return Object.entries(counts)
			.map(([id, count]) => {
				const member = members?.find((m) => m.id === id);
				return {
					uid: member?.id || '',
					name: member?.name || '優しい誰か',
					picture: member?.picture,
					count,
				};
			})
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	};

	const dispatch = createEventDispatcher();

	/**
	 *
	 * @param {string} uid
	 */
	const onClickUser = (uid) => {
		dispatch('clickUser', { uid });
	};
</script>

<div class="ranking">
	<ol>
		{#each rankingBySendCount() as data}
			<li class="list_item">
				<PlainButton on:click={() => onClickUser(data.uid)}>
					<span class="list_item_inner">
						<User user={data} /> : {data.count}枚
					</span>
				</PlainButton>
			</li>
		{/each}
	</ol>
</div>

<style>
	.list_item {
		display: block;
		margin: 0.5rem;
	}

	.list_item_inner {
		display: flex;
		align-items: center;
	}
</style>
