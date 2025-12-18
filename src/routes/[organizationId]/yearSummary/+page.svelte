<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import User from '$lib/components/User.svelte';
  import Introduction from 'src/lib/components/views/[organizationId]/yearSummary/Introduction.svelte';
  import TotalCardCount from 'src/lib/components/views/[organizationId]/yearSummary/TotalCardCount.svelte';
  import MemberCardRanking from 'src/lib/components/views/[organizationId]/yearSummary/MemberCardRanking.svelte';
  import EmojiRanking from 'src/lib/components/views/[organizationId]/yearSummary/EmojiRanking.svelte';

  export let data;
  const summary = data.summary;

  let step = 0;
  const steps = [
    '表紙',
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
  <div class="card">
    {#if step === 0}
      <Introduction {year} />
    {:else if step === 1}
      <TotalCardCount title="受け取った枚数" count={summary.totalReceived || 0} />
    {:else if step === 2}
      <TotalCardCount title="送った枚数" count={summary.totalSent || 0} />
    {:else if step === 3}
      <MemberCardRanking
        title="最もカードを貰ったメンバーランキング"
        members={$members}
        data={[summary.mostReceivedFrom]}
      />
    {:else if step === 4}
      <MemberCardRanking
        title="最もカードを送ったメンバーランキング"
        members={$members}
        data={[summary.mostSentTo]}
      />
    {:else if step === 5}
      <EmojiRanking title="送った絵文字ランキング" emojis={summary.topSentEmojis} />
    {:else if step === 6}
      <EmojiRanking title="貰った絵文字ランキング" emojis={summary.topReceivedEmojis} />
    {:else if step === 7}
      <h2>送った最長メッセージ</h2>
      {#if summary.sentLongest}
        <section>
          <p>
            <strong>日付:</strong>
            {new Date(summary.sentLongest.createdAt).toLocaleDateString('ja-JP')}
          </p>
          <p><strong>送信者:</strong> あなた</p>
          <p>
            <strong>宛先:</strong>
            {#if findMember(summary.sentLongest.to, summary.sentLongest.toName)}
              <User user={findMember(summary.sentLongest.to, summary.sentLongest.toName)} />
            {/if}
          </p>
          <p><strong>文字数:</strong> {summary.sentLongest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.sentLongest.message}</pre>
          <p>
            <strong>リアクション:</strong>
            {#if summary.sentLongest.reactions.length}{emojisOf(
                summary.sentLongest
              )}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 8}
      <h2>送った最短メッセージ</h2>
      {#if summary.sentShortest}
        <section>
          <p>
            <strong>日付:</strong>
            {new Date(summary.sentShortest.createdAt).toLocaleDateString('ja-JP')}
          </p>
          <p><strong>送信者:</strong> あなた</p>
          <p>
            <strong>宛先:</strong>
            {#if findMember(summary.sentShortest.to, summary.sentShortest.toName)}
              <User user={findMember(summary.sentShortest.to, summary.sentShortest.toName)} />
            {/if}
          </p>
          <p><strong>文字数:</strong> {summary.sentShortest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.sentShortest.message}</pre>
          <p>
            <strong>リアクション:</strong>
            {#if summary.sentShortest.reactions.length}{emojisOf(
                summary.sentShortest
              )}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 9}
      <h2>貰った最長メッセージ</h2>
      {#if summary.receivedLongest}
        <section>
          <p>
            <strong>日付:</strong>
            {new Date(summary.receivedLongest.createdAt).toLocaleDateString('ja-JP')}
          </p>
          <p>
            <strong>送信者:</strong>
            {#if findMember(summary.receivedLongest.from, summary.receivedLongest.fromName)}
              <User
                user={findMember(summary.receivedLongest.from, summary.receivedLongest.fromName)}
              />
            {/if}
          </p>
          <p><strong>宛先:</strong> あなた</p>
          <p><strong>文字数:</strong> {summary.receivedLongest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.receivedLongest.message}</pre>
          <p>
            <strong>リアクション:</strong>
            {#if summary.receivedLongest.reactions.length}{emojisOf(
                summary.receivedLongest
              )}{:else}なし{/if}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 10}
      <h2>貰った最短メッセージ</h2>
      {#if summary.receivedShortest}
        <section>
          <p>
            <strong>日付:</strong>
            {new Date(summary.receivedShortest.createdAt).toLocaleDateString('ja-JP')}
          </p>
          <p>
            <strong>送信者:</strong>
            {#if findMember(summary.receivedShortest.from, summary.receivedShortest.fromName)}
              <User
                user={findMember(summary.receivedShortest.from, summary.receivedShortest.fromName)}
              />
            {/if}
          </p>
          <p><strong>宛先:</strong> あなた</p>
          <p><strong>文字数:</strong> {summary.receivedShortest.length} 文字</p>
          <p><strong>メッセージ:</strong></p>
          <pre>{summary.receivedShortest.message}</pre>
          <p>
            <strong>リアクション:</strong>
            {#if summary.receivedShortest.reactions.length}{emojisOf(
                summary.receivedShortest
              )}{:else}なし{/if}
            {summary.receivedShortest.fromName}
          </p>
        </section>
      {:else}
        <p>メッセージがありません</p>
      {/if}
    {:else if step === 11}
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
    text-align: center;
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
