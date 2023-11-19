<script>
	import Qr from '$lib/components/Qr.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	/** @type {import('./$types').ActionData} */
	export let form;

	const organizationPage = `${$page.url.host}/${$page.params.organizationId}/join`;

	const copy = async () => {
		if (form) {
			await navigator.clipboard.writeText(`${organizationPage}?token=${form.token}`);

			alert('招待URLをコピーしました！');
		}
	};
</script>

<h2>Invitation</h2>
{#if !form?.token}
	<form method="POST">
		<label>
			有効期限
			<input type="number" name="expirationDays" value="7" />日
		</label>

		<div>
			<button>発行</button>
		</div>
	</form>
{:else}
	<div>
		発行された招待URL: {`${organizationPage}?token=${form.token}`}
	</div>
	<Qr url={`${organizationPage}?token=${form.token}`} />
	<div>
		<button on:click={copy}>コピー</button>
	</div>
{/if}

<style>
</style>
