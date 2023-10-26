<script>
	import User from '$lib/components/User.svelte';

	/**
	 * @type {import('src/types/organization/card').ThanksCard}
	 */
	export let card;

	/** @type {import('src/types/organization/member').OrganizationMember[]} */
	export let members;

	$: to = members.find((m) => m.id === card.to) || { name: '' };
	$: from = members.find((m) => m.id === card.from) || { name: '' };
</script>

<div class="card">
	<div class="from-to">
		<User user={from} />
		->
		<User user={to} />
	</div>
	<div class="message">{card.message}</div>
	<div />
	<div class="time">{card.createdAt}</div>
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
		white-space: pre;
	}

	.time {
		font-size: 0.7rem;
	}
</style>
