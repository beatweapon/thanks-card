<script>
	import { registerMember } from 'src/lib/stores/organization';
	import { registerUser } from 'src/lib/stores/user';

	import { page } from '$app/stores';

	export let data;
	const members = data.organization?.members || [];

	$: isMember = members.map((m) => m.id).includes(data.currentUser.uid);

	let name = '';
	const join = async () => {
		const user = { id: data.currentUser.uid, name, picture: data.currentUser.picture };
		await Promise.all([
			registerMember($page.params.organizationId, user),
			registerUser(data.currentUser.uid, $page.params.organizationId),
		]);

		location.reload();
	};
</script>

<h1>{data.organization?.name}のサンクスカード</h1>

{#if isMember}
	<slot />
{:else}
	名前:<input bind:value={name} />
	<button on:click={join}>参加する</button>
{/if}
