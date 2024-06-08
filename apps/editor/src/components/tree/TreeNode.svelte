<script lang="ts">
	import { System, type Entity } from "@fwge/ecs";
	import { AccordionItem } from "flowbite-svelte";
	import { currentEntityStore } from "../../stores/project.store";

    export let node: Entity | System;

    const isSystem = node instanceof System;
    const entity = node as Entity;
    const system = node as System;
    const children = isSystem ? [] : entity.GetChildren();

    function setActiveEntity(): void
    {
        currentEntityStore.set(entity);
    }

    // function setActiveSystem(): void
    // {
    //     currentEntityStore.set(entity);
    // }
</script>

{#if isSystem }
    <div class="tree-node">
        <p class="mb-2 text-gray-500 dark:text-gray-400">{system.Name}</p>
    </div>
{:else}
    <div class="tree-node">
        {#if children.length > 0}
        <AccordionItem>
            <span slot="header">{entity.Name}</span>
            {#each children as child}
                <svelte:self node={child}/>
            {/each}
        </AccordionItem>
        {:else} 
            <button on:click={setActiveEntity} class="mb-2 text-gray-500 dark:text-gray-400">{entity.Name}</button>
        {/if}
    </div>
{/if}
  
<style>
.tree-node {
    height: 50px;
    cursor: pointer;
}
</style>