<script>
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import FloatButton from '$lib/components/design/FloatButton.svelte';
  watchMemberCollection($page.params.organizationId);

  export let data;

  /** @type {boolean} */
  let processing = false;

  $: $members.forEach((m) => {
    if (!m.permission) {
      m.permission = {
        admin: false,
        read: true,
        write: true,
      };
    }
  });

  const update = async () => {
    processing = true;

    await fetch(`${base}/api/organizations/${$page.params.organizationId}/membersPermission/`, {
      method: 'PUT',
      body: JSON.stringify({
        uid: data.currentUser.uid,
        members: $members,
      }),
    }).finally(() => {
      processing = false;
    });

    goToOrganizationPage();
  };

  const goToOrganizationPage = () => {
    goto(removeLastPathFromURL($page.url.toString()));
  };

  /**
   * @param {string} url
   */
  const removeLastPathFromURL = (url) => {
    // 正規表現でURLから最後のスラッシュとその後の文字列を削除
    return url.replace(/\/[^/]+$/, '');
  };
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
