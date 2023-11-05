<script>
	import User from '$lib/components/User.svelte';
	import { createEventDispatcher } from 'svelte';

	/**
	 * @type {import('src/types/organization/card').ThanksCard}
	 */
	export let card;

	/** @type {import('src/types/organization/member').OrganizationMember[]} */
	export let members;

	const to = members.find((m) => m.id === card.to) || { name: '' };
	const from = members.find((m) => m.id === card.from) || { name: '' };

	const createdAt = card.createdAt.toDate().toLocaleString('ja-JP');

	// イベントディスパッチャーを作成
	const dispatch = createEventDispatcher();

	const onClickFrom = () => {
		dispatch('clickFrom');
	};

	const onClickTo = () => {
		dispatch('clickTo');
	};
</script>

<div class="card">
	<div class="from-to">
		<User user={from} on:click={onClickFrom} />
		->
		<User user={to} on:click={onClickTo} />
	</div>
	<div class="message">{card.message}</div>
	<div />
	<div class="time">{createdAt}</div>
</div>

<style>
	.card {
		margin: 1rem;
		padding: 1rem;
		border: 1px solid #333;
	}

	.from-to {
		display: flex;
		align-items: center;
	}

	.message {
		margin: 1rem 0;
		white-space: pre-wrap;
	}

	.time {
		font-size: 0.7rem;
	}
</style>
