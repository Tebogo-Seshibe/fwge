<script lang="ts">
	import { type Entity, Transform } from "@fwge/core";
	import TransformType from "../fwge-components/TransformComponent.svelte";
	import Panel from "../Panel.svelte";
	import { Label } from "flowbite-svelte";
	import { currentEntityStore } from "../../stores/project.store";
	import { onDestroy, onMount } from "svelte";
	import { type Unsubscriber } from "svelte/store";

    export let id: string;

    let entity: Entity | undefined = undefined;
    let transform: Transform | undefined = undefined;

    let currentEntityUnsubscriber: Unsubscriber;

    //#region Lifetime
    onMount(() => {
        currentEntityUnsubscriber = currentEntityStore.subscribe(currentEntity => {
            entity = currentEntity;
            
            if (!entity) {
                transform = undefined;
                return;
            }

            transform = entity.GetComponent(Transform);
        });
    });

    onDestroy(() => {
        if (currentEntityUnsubscriber) {
            currentEntityUnsubscriber();
        }
    });
    //#endregion

</script>

<Panel {id}>
    <div class='p-2'>
        {#if entity}
            <div id="hierarchy-container">
                <Label>{entity.Name}</Label>
                
                {#if transform}
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