<script>
  export let data;
  const { message, year, orgId } = data;

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
  <h1>{year} 年 — 送った最長メッセージ</h1>

  {#if message}
    <section>
      <p><strong>日付:</strong> {new Date(message.createdAt).toLocaleDateString('ja-JP')}</p>
      <p><strong>送信者:</strong> あなた</p>
      <p><strong>宛先:</strong> {message.toName}</p>
      <p><strong>文字数:</strong> {message.length} 文字</p>
      <p><strong>メッセージ:</strong></p>
      <pre>{message.message}</pre>
      <p>
        <strong>リアクション:</strong>
        {#if message.reactions.length}{emojisOf(message)}{:else}なし{/if}
      </p>
    </section>
  {:else}
    <p>メッセージがありません</p>
  {/if}

  <p><a href={`/${orgId}`}>ホームへ戻る</a></p>
</div>
