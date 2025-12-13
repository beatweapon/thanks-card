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

  /** @type {number} */
  let exportYear = new Date().getFullYear();

  /** @type {boolean} */
  let exporting = false;

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

  const handleExport = async () => {
    if (exporting) return;
    exporting = true;

    try {
      const response = await fetch(
        `${base}/api/organizations/${$page.params.organizationId}/export-cards?year=${exportYear}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        alert('エクスポートに失敗しました');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thanks-cards-${$page.params.organizationId}-${exportYear}.tsv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポートに失敗しました');
    } finally {
      exporting = false;
    }
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

<div class="export-section">
  <h2>カード情報をエクスポート</h2>
  <div class="export-controls">
    <select id="export-year" bind:value={exportYear} disabled={exporting}>
      {#each Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => 2024 + i) as year}
        <option value={year}>{year}</option>
      {/each}
    </select>
    <label for="export-year">年</label>
    <FloatButton on:click={handleExport} disabled={exporting}>
      {exporting ? 'エクスポート中...' : 'エクスポート'}
    </FloatButton>
  </div>
</div>

<div class="members">
  {#each $members as member}
    <div>
      <span>{member.name}</span>
      {#if member.permission}
        <label
          ><input
            type="checkbox"
            bind:checked={member.permission.admin}
            disabled={processing}
          />Admin</label
        >
        <label
          ><input
            type="checkbox"
            bind:checked={member.permission.read}
            disabled={processing}
          />Read</label
        >
        <label
          ><input
            type="checkbox"
            bind:checked={member.permission.write}
            disabled={processing}
          />Write</label
        >
      {/if}
    </div>
  {/each}
  <FloatButton on:click={update} disabled={processing}>更新</FloatButton>
</div>

<style>
  .export-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .export-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .export-controls select,
  .export-controls button {
    padding: 0.5rem;
  }

  .export-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
