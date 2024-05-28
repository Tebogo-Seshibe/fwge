<script lang="ts">
	import { onMount } from "svelte";

    export let name: string;
    let containerDiv: HTMLDivElement;

    onMount(() => {
        containerDiv.id = name;
    })
</script>

<div bind:this={containerDiv} class="panel">
    <div class="panel-header">{name}</div>

    <div class="panel-content">
        <slot></slot>
    </div>
</div>

<style>
.panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #272727EE;
    color: whitesmoke;
}

.panel-header {
    display: flex;
    flex: 0;
    height: 39px;
    width: 100px;
    align-items: center;
    justify-content: flex-start;
    padding: 16px;
    background: #272727FF;
    border-bottom: solid 1px aqua;
    font-weight: 600;
}

.panel-content {
    flex: 1;
    height: auto;
    width: 100%;
}
</style>