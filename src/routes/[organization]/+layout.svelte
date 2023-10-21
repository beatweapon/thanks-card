<script>
	import { registerMember } from 'src/lib/stores/organization';
	import { registerUser } from 'src/lib/stores/user';

	import { page } from '$app/stores';

	export let data;
	const members = data.organization?.members || [];

	$: isMember = members.map((m) => m.id).includes(data.user.id);

	let name = '';
	const join = () => {
		const user = { id: data.user.id, name };
		registerMember($page.params.organization, user);
		registerUser(data.user.id, $page.params.organization);
	};
</script>

<h1>{data.organization?.name}組織レイアウト</h1>

{#if isMember}
	<slot />
{:else}
	名前:<input bind:value={name} />
	<button on:click={join}>参加する</button>
{/if}
