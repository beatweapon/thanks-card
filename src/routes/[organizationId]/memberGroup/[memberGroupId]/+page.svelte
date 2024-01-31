<script>
  import { page } from '$app/stores';
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import { memberGroups, watchMemberGroupCollection } from '$lib/stores/memberGroup.js';
  import User from '$lib/components/User.svelte';

  watchMemberCollection($page.params.organizationId);
  watchMemberGroupCollection($page.params.organizationId);

  $: memberGroup = $memberGroups.find((g) => g.id === $page.params.memberGroupId);
</script>

<h2>{memberGroup?.name}</h2>

<ul>
  {#each $members as member}
    <li class:selected={memberGroup?.memberIds.find((i) => i === member.id)}>
      <User user={member} />
    </li>
  {/each}
</ul>

<style>
  .selected {
    border: solid 1px red;
  }
</style>
