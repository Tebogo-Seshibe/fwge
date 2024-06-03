<script lang="ts">
	import type { Vector3 } from "@fwge/common";
	import type { Transform } from "@fwge/core";
	import type { Entity } from "@fwge/ecs";
	import { Input } from "flowbite-svelte";
	import { onMount } from "svelte";
    import CodeBraces from 'svelte-material-icons/CodeBraces.svelte';
    import CodeJson from 'svelte-material-icons/CodeJson.svelte';

    export let component: Transform;

    let collapsed: boolean = true;
    let step: number = 0.1;

    onMount(() => {
        component.Position.Z = 5;
    })
    
    function scroll(input: 'position' | 'rotation' | 'scale', axis: 'x' | 'y' | 'z', up: boolean): void
    {
        let property: Vector3;

        switch (input)
        {
            case "position": 
                property = component.Position;
            break;

            case "rotation": 
                property = component.Rotation;
            break;

            case "scale": 
                property = component.Scale;
            break;
        }

        switch (axis)
        {
            case "x":
                property.X += up ? step : -step;
            break;

            case "y":
                property.Y += up ? step : -step;
            break;

            case "z":
                property.Z += up ? step : -step;
            break;
        }

        console.log(property)
    }

    setTimeout(() => console.log(component), 2000)
</script>

<div>
    <!-- on:input={event => component.Position.X = +event.currentTarget.value} -->
    <!-- bind:value={component.Position.X} -->
    <!-- step={step}  -->
    <!-- on:wheel|stopPropagation={event => scroll('position', 'x', event.deltaY < 0)} -->
    <!-- class="input-axis" -->
    <!-- name="position-x"  -->
    <Input label="X" name="position-x" type="number" bind:value={component.Position.X} />
    <Input label="Y" name="position-y" type="number" bind:value={component.Position.Y} />
    <Input label="Z" name="position-z" type="number" bind:value={component.Position.Z} />
</div>
