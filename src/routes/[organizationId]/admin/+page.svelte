<script>
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import FloatButton from '$lib/components/design/FloatButton.svelte';
  import { checkExportStatus, aggregateExport, getExportSignedUrl, downloadFile } from '$lib/api/exports.js';
  import { onMount } from 'svelte';

  watchMemberCollection($page.params.organizationId);

  export let data;

  /** @type {boolean} */
  let processing = false;

  /** @type {number} */
  let exportYear = new Date().getFullYear();

  /** @type {boolean} */
  let fileExists = false;

  /** @type {boolean} */
  let checkingStatus = false;

  /** @type {boolean} */
  let exporting = false;

  /** @type {boolean} */
  let isAdmin = false;

  $: isAdmin = $members.some((m) => m.id === data.currentUser.uid && m.permission?.admin === true);

  $: $members.forEach((m) => {
    if (!m.permission) {
      m.permission = {
        admin: false,
        read: true,
        write: true,
      };
    }
  });

  onMount(() => {
    checkFileStatus();
  });

  const checkFileStatus = async () => {
    checkingStatus = true;
    try {
      const result = await checkExportStatus($page.params.organizationId, exportYear, base);
      fileExists = result.exists;
    } catch (error) {
      console.error('Status check error:', error);
      fileExists = false;
    } finally {
      checkingStatus = false;
    }
  };

  const handleYearChange = () => {
    checkFileStatus();
  };

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

  const handleAggregate = async () => {
    if (exporting) return;
    exporting = true;

    try {
      await aggregateExport($page.params.organizationId, exportYear, base);
      fileExists = true;
      alert('集計が完了しました');
    } catch (error) {
      console.error('Aggregate error:', error);
      alert('集計に失敗しました');
    } finally {
      exporting = false;
    }
  };

  const handleDownload = async () => {
    if (exporting || !fileExists) return;
    exporting = true;

    try {
      const result = await getExportSignedUrl($page.params.organizationId, exportYear, base);
      if (result.signedUrl) {
        downloadFile(
          result.signedUrl,
          `thanks-cards-${$page.params.organizationId}-${exportYear}.tsv`
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('ダウンロードに失敗しました');
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

{#if isAdmin}
  <div class="export-section">
    <h2>カード情報をエクスポート</h2>
    <div class="export-controls">
      <select
        id="export-year"
        bind:value={exportYear}
        on:change={handleYearChange}
        disabled={exporting || checkingStatus}
      >
        {#each Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => 2024 + i) as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
      <label for="export-year">年</label>
      <FloatButton on:click={handleAggregate} disabled={exporting}>
        {exporting ? '集計中...' : '集計'}
      </FloatButton>
      <FloatButton on:click={handleDownload} disabled={exporting || !fileExists}>
        {exporting ? 'ダウンロード中...' : fileExists ? 'ダウンロード' : 'ファイルなし'}
      </FloatButton>
    </div>
  </div>
{/if}

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
