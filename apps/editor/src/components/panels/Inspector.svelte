<script lang="ts">
	import { Transform } from "@fwge/core";
	import type { Entity } from "@fwge/ecs";
	import { currentEntityStore } from "../../stores/project.store";
	import TransformType from "../component-types/TransformType.svelte";
	import Panel from "./Panel.svelte";
    export let name: string;

    let entity: Entity | undefined = undefined;
    let transform: Transform | undefined = undefined;

    currentEntityStore.subscribe(currentEntity => {
        entity = currentEntity;
        transform = currentEntity?.GetComponent(Transform);
    })

</script>

<Panel {name}>
    {#if entity && transform}
        <TransformType component={transform}/>
    {/if}
    
</Panel>

<style>

</style>