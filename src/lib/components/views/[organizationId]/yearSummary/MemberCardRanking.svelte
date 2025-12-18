<script>
  import { onMount, tick } from 'svelte';
  import FadeInUp from 'src/lib/components/animation/FadeInUp.svelte';
  import CountUp from 'src/lib/components/animation/CountUp.svelte';
  import User from '$lib/components/User.svelte';

  /** @type {import('src/types/organization/member').OrganizationMember[]} */
  export let members;

  /** @type {string} */
  export let title;

  /** @type {{name: string, count: number}[]} */
  export let data;

  /** @type {InstanceType<typeof FadeInUp>} */
  let fadeInTitle;

  /** @type {InstanceType<typeof FadeInUp>[]} */
  let fadeIns = [];

  /** @type {InstanceType<typeof CountUp>[]} */
  let counters = [];

  console.log(data);

  /**
   * Find a member by id or name
   * @param {string|undefined} id
   * @param {string|undefined} name
   */
  function findMember(id, name) {
    return (
      members.find((m) => (id && m.id === id) || (name && m.name === name)) || {
        name: name || '不明なメンバー',
      }
    );
  }

  export const play = async () => {
    await tick();
    await fadeInTitle.play();
    for (const fadeIn of fadeIns) {
      if (fadeIn) {
        await fadeIn.play();
      }
    }
    for (const counter of counters) {
      if (counter) {
        await counter.play();
      }
    }
  };

  onMount(async () => {
    await tick();
    await play();
  });
</script>

<FadeInUp bind:this={fadeInTitle}>
  <h2>{title}</h2>
</FadeInUp>
{#if data && data.length}
  <ol>
    {#each data as d, i}
      <FadeInUp bind:this={fadeIns[i]}>
        <li>
          <div class="user_name_count">
            <User user={findMember(undefined, data[i]?.name)} />
            —
            <CountUp to={data[i]?.count} bind:this={counters[i]} />
          </div>
        </li>
      </FadeInUp>
    {/each}
  </ol>
{:else}
  <p>なし</p>
{/if}

<style>
  .user_name_count {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
</style>
