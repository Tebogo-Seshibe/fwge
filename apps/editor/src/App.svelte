<script lang="ts">
  import Launcher from './pages/Launcher.svelte';
  import Renderer from './pages/Renderer.svelte';
</script>

<main class="container">
    <!-- <Launcher /> -->
    <Renderer />
</main>

<style>
  main {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>