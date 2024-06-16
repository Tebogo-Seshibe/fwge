<script lang="ts">
	import { System, type Entity } from '@fwge/ecs';
	import { Li, List } from 'flowbite-svelte';
	import { CaretDownSolid, CaretRightSolid } from 'flowbite-svelte-icons';
	import { currentEntityStore } from '../stores/project.store';

	export let node: Entity | System;

	const isSystem = node instanceof System;
	const entity = node as Entity;
	// const system = node as System;
	const children = isSystem ? [] : entity.GetChildren();
	let toggled: boolean = false;

	const [name, description] = [node.Name, (node as Object).constructor.name];
    let activeEntityId = -1;

	function toggle(): void {
		toggled = !toggled;
	}

	function setActiveEntity(): void {
		currentEntityStore.set(entity);
        activeEntityId = entity.Id;
	}

	function setActiveSystem(): void {
		currentEntityStore.set(entity);
	}
</script>

{#if isSystem}
    <Li liClass="grid mb-1 auto-rows-min grid-cols-[18px_1fr]">
        <span
            class="h-5 col-start-2 col-end-3 row-start-1 row-end-2 font-bold text-md cursor-pointer text-gray-50"
            tabindex="0"
            role="button"
            on:keypress={setActiveSystem}
            on:click={setActiveSystem}
        >{name}</span>

        <span 
            class="h-4 col-start-2 col-end-3 row-start-2 row-end-3 text-gray-500 text-sm"
            tabindex="0"

            role="button"
            on:keypress="{setActiveSystem}"
            on:click="{setActiveSystem}"
        >{description}</span>
    </Li>
{:else}
	<Li liClass="grid mb-1 auto-rows-min grid-cols-[18px_1fr] {activeEntityId === entity.Id ? 'bg-[#444444]' : ''}">
		<span
			class="h-5 col-start-2 col-end-3 row-start-1 row-end-2 font-bold text-md cursor-pointer text-gray-50"
			tabindex="0"
			role="button"
			on:keypress|stopPropagation={setActiveEntity}
			on:click|stopPropagation={setActiveEntity}
		>{name}</span>

        <span 
            class="h-4 col-start-2 col-end-3 row-start-2 row-end-3 text-gray-500 text-sm"
            tabindex="0"
            role="button"
            on:keypress|stopPropagation="{setActiveSystem}"
            on:click|stopPropagation="{setActiveSystem}"
        >{description}</span>

        {#if children.length > 0}
        <span
            class="grid col-start-2 col-end-3 row-start-3 row-end-4 text-gray-500 overflow-hidden {toggled ? 'h-auto' : 'h-0'}"
            tabindex="0"
            role="button"
        >
            <List tag="ul" list='none' >
                {#each children as child}
                <svelte:self node={child} />
                {/each}
            </List>
        </span>
		{/if}
            

        {#if children.length > 0}
        <span
            class="col-start-1 col-end-2 row-start-1 row-end-4 text-gray-50"
            tabindex="0"
            role="button"
            on:keypress={toggle}
            on:click={toggle}
        >
            {#if toggled} <CaretDownSolid class='mt-1' /> {:else} <CaretRightSolid class='mt-1' /> {/if}
        </span>
        {/if}
	</Li>
{/if}
