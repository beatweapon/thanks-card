<script>
  import { onMount } from 'svelte';
  import PlainButton from '$lib/components/design/PlainButton.svelte';
  import SideMenu from './SideMenu.svelte';

  /** @type {string} */
  export let organizationName;

  /** @type {string} */
  export let organizationId;

  /** @type {number} */
  export let thanksPoint = 0;

  /** @type {HTMLElement} */
  let menuButtonRef;

  /** @type {HTMLElement} */
  let sideMenuRef;

  let isOpenSideMenu = false;

  const toggleSideMenu = () => {
    isOpenSideMenu = !isOpenSideMenu;
  };

  const closeMenu = () => {
    isOpenSideMenu = false;
  };

  onMount(() => {
    /**
     *
     * @param {MouseEvent} event
     */
    const handleOutsideClick = (event) => {
      if (!event.target) return;

      const target = /** @type {Node} */ (event.target);

      if (menuButtonRef.contains(target)) return;
      if (sideMenuRef.contains(target)) return;

      closeMenu();
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  });
</script>

<header class="header">
  <h1 class="organization_name">
    <a href={`/${organizationId}`}>{organizationName}</a>
  </h1>

  <div bind:this={menuButtonRef} class="menu">
    <a on:click={closeMenu} href={`/${organizationId}/shop`}>{thanksPoint} Point</a>
    <PlainButton on:click={toggleSideMenu}>メニュー</PlainButton>
  </div>
</header>

<div class="header_space" />

<div bind:this={sideMenuRef}>
  <SideMenu isOpen={isOpenSideMenu} on:close={closeMenu} />
</div>

<style>
  .header {
    position: fixed;
    z-index: +101;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
  }

  .organization_name {
    margin-left: 0.5rem;
    font-size: 1rem;
    color: white;
    text-shadow:
      1px 1px 1px #555,
      1px 1px 1px #fff;
  }

  .menu {
    margin-right: 0.5rem;
    font-weight: bold;
    color: white;
    text-shadow:
      1px 1px 1px #555,
      1px 1px 1px #fff;
  }

  .header_space {
    height: 2rem;
  }
</style>
