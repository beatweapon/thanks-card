<script>
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { members, watchMemberCollection } from '$lib/stores/members.js';
  import { memberGroups, watchMemberGroupCollection } from '$lib/stores/memberGroup.js';
  import Qr from '$lib/components/Qr.svelte';
  import In7DaysCards from '$lib/components/views/[organizationId]/In7DaysCards.svelte';
  import AllCards from '$lib/components/views/[organizationId]/AllCards.svelte';
  import FloatActionButton from '$lib/components/design/FloatActionButton.svelte';
  import FloatButton from '$lib/components/design/FloatButton.svelte';
  import PlainButton from '$lib/components/design/PlainButton.svelte';
  import User from '$lib/components/User.svelte';

  export let data;

  let isShowAllCardList = false;

  const toggleShowCardList = () => {
    isShowAllCardList = !isShowAllCardList;
  };

  watchMemberCollection($page.params.organizationId);
  watchMemberGroupCollection($page.params.organizationId);

  const filterOption = { from: '', to: '', memberGroupId: '' };

  /**
   * カスタムイベントを処理する関数
   *
   * @param {string} uid - カスタムイベントオブジェクト
   * @returns {void}
   */
  const setFilterOptionFrom = (uid) => {
    filterOption.to = '';
    filterOption.from = filterOption.from !== uid ? uid : '';
  };

  /**
   * カスタムイベントを処理する関数
   *
   * @param {string} uid - カスタムイベントオブジェクト
   * @returns {void}
   */
  const setFilterOptionTo = (uid) => {
    filterOption.from = '';
    filterOption.to = filterOption.to !== uid ? uid : '';
  };

  /**
   *
   * @param {string} uid
   */
  const setFilterOptionFromAndTo = (uid) => {
    filterOption.from = '';
    filterOption.to = uid;
  };

  /**
   * @type {(status: import('src/types/organization/card').ThanksCard) => boolean}
   */
  $: cardFilter = (card) => {
    if (filterOption.memberGroupId) {
      const memberIds = $memberGroups.find((m) => m.id === filterOption.memberGroupId)?.memberIds;

      if (!memberIds?.find((id) => id === card.to)) {
        return false;
      }
    }

    // フィルター設定がないならtrueを返す
    if (!filterOption.to && !filterOption.from) {
      return true;
    }

    if (filterOption.to) {
      if (filterOption.to === card.to) {
        return true;
      }
    }

    if (filterOption.from) {
      if (filterOption.from === card.from) {
        return true;
      }
    }

    return false;
  };
  /** @type {Object<string, NodeJS.Timeout>} */
  let cardDeletingSlot = {};

  /**
   * リアクション追加処理
   * @param {import('src/types/organization/card').ThanksCard} card
   * @param {string} emoji
   */
  const addReaction = async (card, emoji) => {
    const senderId = data.currentUser.uid;
    const sender = $members.find((m) => m.id === senderId);

    await fetch(
      `${base}/api/organizations/${$page.params.organizationId}/cards/${card.id}/reactions`,
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          uid: senderId,
          emoji,
          senderName: sender?.name,
          senderIcon: data.currentUser.picture,
          cardSenderId: card.from,
        }),
      }
    );
  };
</script>

<h2>Welcome to TopPage</h2>
<div class="fab">
  <FloatActionButton on:click={() => goto(`${$page.url}/thanksCardEditor`)}>❤</FloatActionButton>
</div>

<FloatButton on:click={toggleShowCardList}>
  {#if isShowAllCardList}
    直近7日
  {:else}
    全て
  {/if}
</FloatButton>

<div class="members">
  {#each $members as member}
    <PlainButton on:click={() => setFilterOptionFromAndTo(member.id)}>
      <div class="member" class:selected={filterOption.to === member.id}>
        <User user={member} />
      </div>
    </PlainButton>
  {/each}
</div>

{#if isShowAllCardList}
  <AllCards
    organizationId={$page.params.organizationId}
    currentUser={data.currentUser}
    members={$members}
    {cardFilter}
    {cardDeletingSlot}
    on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
    on:clickFrom={(e) => setFilterOptionFrom(e.detail)}
    on:clickTo={(e) => setFilterOptionTo(e.detail)}
    on:addReaction={(e) => addReaction(e.detail.card, e.detail.emoji)}
  />
{:else}
  <In7DaysCards
    organizationId={$page.params.organizationId}
    currentUser={data.currentUser}
    members={$members}
    {cardFilter}
    {cardDeletingSlot}
    on:clickUser={(e) => setFilterOptionFrom(e.detail.uid)}
    on:clickFrom={(e) => setFilterOptionFrom(e.detail)}
    on:clickTo={(e) => setFilterOptionTo(e.detail)}
    on:addReaction={(e) => addReaction(e.detail.card, e.detail.emoji)}
  />
{/if}

<h2>この画面のQRコード</h2>
<Qr url={$page.url.href} />

<style>
  .fab {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 5;
  }

  .members {
    display: flex;
    flex-wrap: wrap;
  }

  .member {
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 0.5rem;
    margin: 0.5rem;
  }

  .member.selected {
    border: 1px solid #f00;
  }
</style>
