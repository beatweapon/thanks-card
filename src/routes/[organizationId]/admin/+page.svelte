<script>
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import { page } from '$app/stores';
  import FloatButton from 'src/lib/components/design/FloatButton.svelte';
  watchMemberCollection($page.params.organizationId);

  $: $members.forEach((m) => {
    if (!m.permission) {
      m.permission = {
        admin: false,
        read: true,
        write: true,
      };
    }
  });

  const update = () => {};
</script>

<div class="members">
  {#each $members as member}
    <div>
      <span>{member.name}</span>
      {#if member.permission}
        <label><input type="checkbox" bind:checked={member.permission.admin} />Admin</label>
        <label><input type="checkbox" bind:checked={member.permission.read} />Read</label>
        <label><input type="checkbox" bind:checked={member.permission.write} />Write</label>
      {/if}
    </div>
  {/each}
  <FloatButton on:click={update}>更新</FloatButton>
</div>
