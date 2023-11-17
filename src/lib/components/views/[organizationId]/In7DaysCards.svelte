<script>
	import { cards, watchCardCollection } from '$lib/stores/cardInPeriod.js';
	import SendRangking from 'src/lib/components/views/[organizationId]/SendRangking.svelte';
	import CardList from 'src/lib/components/views/[organizationId]/CardList.svelte';

	/** @type {string} */
	export let organizationId;

	/** @type {import('src/types/user').User} */
	export let currentUser;

	/** @type {import('src/types/organization/member').OrganizationMember[]} */
	export let members;

	/** @type {Object<string, NodeJS.Timeout>} */
	export let cardDeletingSlot = {};

	/**
	 *
	 * @param  {import('src/types/organization/card').ThanksCard} c
	 */
	export let cardFilter = (c) => true;

	watchCardCollection(organizationId);

	$: filteredCards = $cards.filter(cardFilter);
</script>

<h2>Send Ranking In 7days</h2>
<SendRangking cards={$cards} {members} on:clickUser />

<h2>Thanks Cards In 7days</h2>
<CardList
	{currentUser}
	cards={filteredCards}
	{members}
	{cardDeletingSlot}
	on:clickFrom
	on:clickTo
	on:addReaction
	on:addCardDeletingSlot
	on:removeCardDeletingSlot
/>
