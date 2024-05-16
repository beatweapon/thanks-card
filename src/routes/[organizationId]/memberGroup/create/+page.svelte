<script>
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import PlainButton from '$lib/components/design/PlainButton.svelte';
  import FloatButton from '$lib/components/design/FloatButton.svelte';
  import User from '$lib/components/User.svelte';

  watchMemberCollection($page.params.organizationId);

  let name = '';

  /** @type {string[]} */
  let memberIds = [];

  /**
   * グループに追加あるいは除外する
   * @param {string} id
   */
  const toggleMember = (id) => {
    const index = memberIds.findIndex((m) => m === id);
    if (index < 0) {
      memberIds = [...memberIds, id];
    } else {
      memberIds = [...memberIds.slice(0, index), ...memberIds.slice(index + 1)];
    }
  };

  const create = async () => {
    if (!name) return;
    if (memberIds.length === 0) return;

    await fetch(`${base}/api/organizations/${$page.params.organizationId}/memberGroup`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        memberIds,
      }),
    });

    goto(`/${$page.params.organizationId}`);
  };
</script>

<h2>メンバーグループ新規作成</h2>

<label>グループ名<input bind:value={name} /></label>

<div class="members">
  {#each $members as member}
    <div class:selected={memberIds.find((m) => m === member.id)}>
      <PlainButton on:click={() => toggleMember(member.id)}>
        <User user={member} />
      </PlainButton>
    </div>
  {/each}
</div>

<FloatButton on:click={create}>作成</FloatButton>

<style>
  .members {
    margin: 1rem;
  }

  .selected {
    border: solid 1px red;
  }
</style>
