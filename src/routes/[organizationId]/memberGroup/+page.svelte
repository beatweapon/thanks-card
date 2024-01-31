<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { memberGroups, watchMemberGroupCollection } from '$lib/stores/memberGroup.js';

  watchMemberGroupCollection($page.params.organizationId);

  /**
   * 新規作成画面へ遷移する
   */
  const goToCreate = () => {
    goto(`${$page.url}/create`);
  };

  /**
   * 編集画面へ遷移する
   * @param {string} id
   */
  const goToEdit = (id) => {
    goto(`${$page.url}/${id}`);
  };
</script>

<h2>メンバーグループ</h2>

<button on:click={() => goToCreate()}>新規作成</button>

<div>グループ一覧</div>
<ul>
  {#each $memberGroups as group}
    <li>
      <button on:click={() => goToEdit(group.id)}>{group.name} ({group.memberIds.length}人)</button>
    </li>
  {/each}
</ul>
