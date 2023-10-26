<script>
	import UserIcon from '$lib/components/UserIcon.svelte';

	/**
	 * @type {import('src/types/organization/card').ThanksCard}
	 */
	export let card;

	/** @type {import('src/types/organization/member').OrganizationMember[]} */
	export let members;

	$: to = members.find((m) => m.id === card.to);
	$: from = members.find((m) => m.id === card.from);
</script>

<div class="card">
	<div>to: <UserIcon src={to?.picture} />{to?.name}</div>
	<div class="message">{card.message}</div>
	<div>from: <UserIcon src={from?.picture} /> {from?.name}</div>
	<div class="time">{card.createdAt}</div>
</div>

<style>
	.card {
		margin: 1rem;
		padding: 1rem;
		border: 1px solid #333;
	}

	.message {
		margin: 1rem 0;
		white-space: pre;
	}

	.time {
		font-size: 0.7rem;
	}
</style>
