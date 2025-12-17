<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { members, watchMemberCollection } from '$lib/stores/members.js';

  export let data;
  const summary = data.summary;

  let step = 0;
  const steps = [
    '受け取った枚数',
    '送った枚数',
    '最もカードを貰った相手',
    '最もカードを送った相手',
    '送った絵文字ランキング (上位3)',
    '貰った絵文字ランキング (上位3)',
    '送った最長メッセージ',
    '送った最短メッセージ',
    '貰った最長メッセージ',
    '貰った最短メッセージ',
    '全表示',
  ];

  const orgId = data.orgId || '';
  const year = summary?.year || new Date().getFullYear();

  // start watching members so we can show avatars next to names
  watchMemberCollection(orgId);

  /**
   * Find a member by id or name
   * @param {string|undefined} id
   * @param {string|undefined} name
   */
  function findMember(id, name) {
    return $members.find((m) => (id && m.id === id) || (name && m.name === name));
  }

  async function next() {
    if (step < steps.length - 1) {
      step += 1;
      return;
    }
    // 最後のステップで Next を押したらホームへ戻る
    await setViewed();
    goto(`/${orgId}`);
  }
  function prev() {
    if (step > 0) step -= 1;
  }

  async function setSuppressed() {
    try {
      await fetch(`/${orgId}/yearSummary/set-flag`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'suppressed', year }),
      });
    } catch (e) {
      console.error('setSuppressed failed', e);
    }
    goto(`/${orgId}`);
  }

  async function setViewed() {
    try {
      await fetch(`/${orgId}/yearSummary/set-flag`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'viewed', year }),
      });
    } catch (e) {
      console.error('setViewed failed', e);
    }
  }

  // removed showAll() — 'すべて表示' button was removed

  /** @param {any} o */
  function emojisOf(o) {
    if (!o || !o.reactions) return '';
    return o.reactions
      .map((/** @type {any} */ r) => r.emoji)
      .filter(Boolean)
      .join(' ');
  }

  onMount(() => {
    // no-op for now
  });
</script>

<div class="year-summary">
  <h1>{year} 年のサマリ</h1>

  <div class="card">
    {#if step === 0}
      <h2>受け取った枚数</h2>
      <p>{summary.totalReceived || 0} 枚</p>
    {:else if step === 1}
      <h2>送った枚数</h2>
      <p>{summary.totalSent || 0} 枚</p>
    {:else if step === 2}
      <h2>最もカードを貰った相手</h2>
      <p>
        {#if summary.mostReceivedFrom}
          {#if findMember(undefined, summary.mostReceivedFrom.name)}
            <img src={findMember(undefined, summary.mostReceivedFrom.name).picture} alt={findMember(undefined, summary.mostReceivedFrom.name).name} class="avatar" />
          {/if}
          {summary.mostReceivedFrom.name} ({summary.mostReceivedFrom.count})
        {:else}
          なし
        {/if}
      </p>
    {:else if step === 3}
      <h2>最もカードを送った相手</h2>
      <p>
        {#if summary.mostSentTo}
          {#if findMember(undefined, summary.mostSentTo.name)}
            <img src={findMember(undefined, summary.mostSentTo.name).picture} alt={findMember(undefined, summary.mostSentTo.name).name} class="avatar" />
          {/if}
          {summary.mostSentTo.name} ({summary.mostSentTo.count})
        {:else}
          なし
        {/if}
      </p>
    {:else if step === 4}
      <h2>送った絵文字ランキング (上位3)</h2>
      {#if summary.topSentEmojis && summary.topSentEmojis.length}
        <ol>
          {#each summary.topSentEmojis as e}
            <li>{e.emoji} — {e.count}</li>
          {/each}
        </ol>
      {:else}
        <p>なし</p>
      {/if}
    {:else if step === 5}
      <h2>貰った絵文字ランキング (上位3)</h2>
      {#if summary.topReceivedEmojis && summary.topReceivedEmojis.length}
        <ol>
          {#each summary.topReceivedEmojis as e}
            <li>{e.emoji} — {e.count}</li>
          {/each}
        </ol>
      {:else}
        <p>なし</p>
      {/if}
      {:else if step === 6}
      <h2>送った最長メッセージ</h2>
      {#if summary.sentLongest}
        <section>
          <p><strong>日付:</strong> {new Date(summary.sentLongest.createdAt).toLocaleDateString('ja-JP')}</p>
          <p><strong>送信者:</strong> あなた</p>
          <p>
            <strong>宛先:</strong>
            {#if findMember(summary.sentLongest.to, summary.sentLongest.toName)}
              <img src={findMember(summary.sentLongest.to, summary.sentLongest.toName).picture} alt={findMember(summary.sentLongest.to, summary.sentLongest.toName).name} class="avatar" />
            {/if}
            {summary.sentLongest.toName}
          </p>
          <p><strong>文字数:</strong> {summary.sentLongest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.sentLongest.message}</pre>
          <p>
            <strong>リアクション:</strong> {#if summary.sentLongest.reactions.length}{emojisOf(summary.sentLongest)}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 7}
      <h2>送った最短メッセージ</h2>
      {#if summary.sentShortest}
        <section>
          <p><strong>日付:</strong> {new Date(summary.sentShortest.createdAt).toLocaleDateString('ja-JP')}</p>
          <p><strong>送信者:</strong> あなた</p>
          <p>
            <strong>宛先:</strong>
            {#if findMember(summary.sentShortest.to, summary.sentShortest.toName)}
              <img src={findMember(summary.sentShortest.to, summary.sentShortest.toName).picture} alt={findMember(summary.sentShortest.to, summary.sentShortest.toName).name} class="avatar" />
            {/if}
            {summary.sentShortest.toName}
          </p>
          <p><strong>文字数:</strong> {summary.sentShortest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.sentShortest.message}</pre>
          <p>
            <strong>リアクション:</strong> {#if summary.sentShortest.reactions.length}{emojisOf(summary.sentShortest)}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 8}
      <h2>貰った最長メッセージ</h2>
      {#if summary.receivedLongest}
        <section>
          <p><strong>日付:</strong> {new Date(summary.receivedLongest.createdAt).toLocaleDateString('ja-JP')}</p>
          <p>
            <strong>送信者:</strong>
            {#if findMember(summary.receivedLongest.from, summary.receivedLongest.fromName)}
              <img src={findMember(summary.receivedLongest.from, summary.receivedLongest.fromName).picture} alt={findMember(summary.receivedLongest.from, summary.receivedLongest.fromName).name} class="avatar" />
            {/if}
            {summary.receivedLongest.fromName}
          </p>
          <p><strong>宛先:</strong> あなた</p>
          <p><strong>文字数:</strong> {summary.receivedLongest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.receivedLongest.message}</pre>
          <p>
            <strong>リアクション:</strong> {#if summary.receivedLongest.reactions.length}{emojisOf(summary.receivedLongest)}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 9}
      <h2>貰った最短メッセージ</h2>
      {#if summary.receivedShortest}
        <section>
          <p><strong>日付:</strong> {new Date(summary.receivedShortest.createdAt).toLocaleDateString('ja-JP')}</p>
          <p>
            <strong>送信者:</strong>
            {#if findMember(summary.receivedShortest.from, summary.receivedShortest.fromName)}
              <img src={findMember(summary.receivedShortest.from, summary.receivedShortest.fromName).picture} alt={findMember(summary.receivedShortest.from, summary.receivedShortest.fromName).name} class="avatar" />
            {/if}
            {summary.receivedShortest.fromName}
          </p>
          <p><strong>宛先:</strong> あなた</p>
          <p><strong>文字数:</strong> {summary.receivedShortest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.receivedShortest.message}</pre>
          <p>
            <strong>リアクション:</strong> {#if summary.receivedShortest.reactions.length}{emojisOf(summary.receivedShortest)}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 10}
      <h2>全表示</h2>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    {/if}
  </div>

  <div class="controls">
    <button on:click={prev} disabled={step === 0}>前へ</button>
    <button on:click={next}>次へ</button>
    <button on:click={setSuppressed}>後で見る</button>
  </div>
</div>

<style>
  .year-summary {
    padding: 1rem;
  }
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 6px;
  }
  .controls {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }
  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    vertical-align: middle;
    margin-right: 0.5rem;
  }
</style>
