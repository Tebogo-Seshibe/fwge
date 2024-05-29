<script lang="ts">
	import { onMount } from "svelte";

    export let name: string;
    export let withHeader: boolean = true;

    let containerDiv: HTMLDivElement;

    onMount((): void => {
        containerDiv.id = name;
    })
</script>

<div bind:this={containerDiv} class="panel {withHeader ? 'header' : 'no-header'}">
    {#if withHeader}
        <div class="panel-header">{name}</div>
    {/if}

    <div class="panel-content">
        <slot></slot>
    </div>
</div>

<style>
.panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #272727F8;
    color: whitesmoke;
    outline: solid 1px gray;
}

.panel-header {
    display: flex;
    flex: 0;
    height: 19px;
    align-items: center;
    justify-content: flex-start;
    padding: 4px 8px;
    background: #272727FF;
    border-bottom: solid 1px aqua;
    font-size: 12px;
    font-weight: 600;
}

.panel-content {
    flex: 1;
    height: auto;
    width: 100%;
    height: 100%;
}
</style>