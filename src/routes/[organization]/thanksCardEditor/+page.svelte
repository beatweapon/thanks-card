<script>
	export let data;

	const members = data.organization.members || [];

	/**
	 * @type {string}
	 */
	let message = '';

	const sendMessage = async () => {
		console.log('send');
	};
</script>

<h1>Card Editor</h1>

<pre>
  {JSON.stringify(data, null, 2)}
</pre>

{#each members as member}
	<div>{member.name}</div>
{/each}

<textarea bind:value={message} />

<button on:click={sendMessage}>カードを贈る</button>

<div>{message}</div>
