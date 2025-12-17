<script>
  export let data;
  const { receivedLongest, receivedShortest, year } = data;

  /** @param {any} o */
  function emojisOf(o) {
    if (!o || !o.reactions) return '';
    return o.reactions
      .map((/** @type {any} */ r) => r.emoji)
      .filter(Boolean)
      .join(' ');
  }
</script>

<div>
  <h1>{year} 年 — 受け取ったメッセージ詳細</h1>

  {#if receivedLongest}
    <section>
      <h2>最長 ({receivedLongest.length} 文字)</h2>
      <p>送信者: {receivedLongest.fromName}</p>
      <pre>{receivedLongest.message}</pre>
      <p>
        リアクション: {#if receivedLongest.reactions.length}{emojisOf(
            receivedLongest
          )}{:else}なし{/if}
      </p>
    </section>
  {/if}

  {#if receivedShortest}
    <section>
      <h2>最短 ({receivedShortest.length} 文字)</h2>
      <p>送信者: {receivedShortest.fromName}</p>
      <pre>{receivedShortest.message}</pre>
      <p>
        リアクション: {#if receivedShortest.reactions.length}{emojisOf(
            receivedShortest
          )}{:else}なし{/if}
      </p>
    </section>
  {/if}

  <p><a href="..">戻る</a></p>
</div>
