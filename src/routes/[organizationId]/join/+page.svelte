<script>
	import { registerMember } from 'src/lib/stores/organization';
	import { registerUser } from 'src/lib/stores/user';
	import { page } from '$app/stores';
	export let data;

	let processing = false;

	let name = '';
	const join = async () => {
		processing = true;

		const user = { id: data.currentUser.uid, name, picture: data.currentUser.picture };
		await Promise.all([
			registerMember($page.params.organizationId, user),
			registerUser(data.currentUser.uid, $page.params.organizationId),
		]);

		location.reload();
	};

	$: disabled = !name || processing;
</script>

<div class="center">
	<div>
		<h1>サンクスカード</h1>
		<p>{data.organization?.name}のサンクスカードに参加して感謝の気持ちを贈り合いましょう！</p>
		<label>
			あなたの名前: <input bind:value={name} />
		</label>
		<button on:click={join} {disabled}>参加する</button>
	</div>
</div>

<style>
	.center {
		margin: 1rem;
		height: calc(100dvh - 40px);
		display: grid;
		justify-content: center;
		align-items: center;
	}
</style>
