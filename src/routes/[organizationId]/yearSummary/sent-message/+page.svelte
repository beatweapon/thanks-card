<script>
  export let data;
  const { sentLongest, sentShortest, year } = data;

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
  <h1>{year} 年 — 送ったメッセージ詳細</h1>

  {#if sentLongest}
    <section>
      <h2>最長 ({sentLongest.length} 文字)</h2>
      <p>宛先: {sentLongest.toName}</p>
      <pre>{sentLongest.message}</pre>
      <p>
        リアクション: {#if sentLongest.reactions.length}{emojisOf(sentLongest)}{:else}なし{/if}
      </p>
    </section>
  {/if}

  {#if sentShortest}
    <section>
      <h2>最短 ({sentShortest.length} 文字)</h2>
      <p>宛先: {sentShortest.toName}</p>
      <pre>{sentShortest.message}</pre>
      <p>
        リアクション: {#if sentShortest.reactions.length}{emojisOf(sentShortest)}{:else}なし{/if}
      </p>
    </section>
  {/if}

  <p><a href="..">戻る</a></p>
</div>
