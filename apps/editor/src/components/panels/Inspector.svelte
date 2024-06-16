<script lang="ts">
	import { Transform } from "@fwge/core";
	import type { Entity } from "@fwge/ecs";
	import TransformType from "../fwge-components/TransformComponent.svelte";
	import Panel from "../Panel.svelte";
	import { Label } from "flowbite-svelte";
	import { currentEntityStore } from "../../stores/project.store";
    export let id: string;

    let entity: Entity | undefined = undefined;
    let transform: Transform | undefined = undefined;

    currentEntityStore.subscribe(currentEntity => {
        entity = currentEntity;
        transform = currentEntity?.GetComponent(Transform);
    })

</script>

<Panel {id}>
    <div class='p-2'>
        {#if entity}
            <div id="hierarchy-container">
                <Label>{entity.Name}</Label>
                
                {#if entity && transform}
                    <TransformType component={transform}/>
                {/if}
            </div>
        {/if}
    </div>
</Panel>

<style>
#hierarchy-container {
    padding: 8px;   
}
</style>