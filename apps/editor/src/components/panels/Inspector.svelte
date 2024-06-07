<script lang="ts">
	import { Transform } from "@fwge/core";
	import type { Entity } from "@fwge/ecs";
	import { currentEntityStore } from "../../stores/project.store";
	import TransformType from "../component-types/TransformType.svelte";
	import Panel from "./Panel.svelte";
	import { Label } from "flowbite-svelte";
    export let name: string;

    let entity: Entity | undefined = undefined;
    let transform: Transform | undefined = undefined;

    currentEntityStore.subscribe(currentEntity => {
        entity = currentEntity;
        transform = currentEntity?.GetComponent(Transform);
    })

</script>

<Panel {name}>
    {#if entity}
        <div id="hierarchy-container">
            <Label>{entity.Name}</Label>
            
            {#if entity && transform}
                <TransformType component={transform}/>
            {/if}
        </div>
    {/if}
</Panel>

<style>
#hierarchy-container {
    padding: 8px;   
}
</style>