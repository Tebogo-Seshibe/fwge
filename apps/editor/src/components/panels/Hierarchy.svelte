<script lang="ts">
	import { type DecoratorManager, type Scene, type SceneId } from '@fwge/core';
	import { Entity, Registry, System, type Class, type Component } from '@fwge/ecs';
	import
		{
			Button,
			ButtonGroup,
			Dropdown,
			DropdownItem,
			Input,
			InputAddon,
			List
		} from 'flowbite-svelte';
	import { CogSolid, DrawSquareSolid, FilterOutline, SearchOutline } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { writable, type Unsubscriber } from 'svelte/store';
	import { currentGameStore } from '../../stores/project.store';
	import Panel from '../Panel.svelte';
	import TreeNode from '../TreeNode.svelte';

	export let id: string;

	let entities: Entity[] = [];
	let systems: System[] = [];
    let decoratorManager: DecoratorManager;
	let tab: 'entities' | 'systems' = 'entities';
    
    let currentSceneUnsubcriber: Unsubscriber;
    let projectUnsubcriber: Unsubscriber;

	let filteredEntites: Entity[] = [];
	let filters = writable({
		components: [] as Class<Component>[],
		systems: [] as Class<System>[],
		name: ''
	});
	filters.subscribe((f) => {
		const name = f.name.toLocaleLowerCase().trim();

		filteredEntites = entities
			.filter((entity) => entity.HasComponents(...f.components))
			.filter((entity) => {
				return (
					name.length === 0 ||
					entity.Name.toLocaleLowerCase().includes(name) ||
					(entity as Object).constructor.name.toLocaleLowerCase().includes(name)
				);
			});
	});

    onMount(() => {
        projectUnsubcriber = currentGameStore.subscribe((project) => {
            if (!project) {
                return;
            }
            decoratorManager = (window as any).DecoratorManager as DecoratorManager;
            console.log({ decoratorManager })
        });
    });
    
    onDestroy(() => {
        currentSceneUnsubcriber();
        projectUnsubcriber();
    });
    
	function updateNameFilters(event: Event): void {
		filters.update((x) => {
			return {
				...x,
				name: (event.target as HTMLInputElement).value
			};
		});
	}

	function updateEntityFilters(event: Event, insert: boolean): void {
		filters.update((x) => {
			return {
				...x,
				name: (event.target as HTMLInputElement).value
			};
		});
	}
</script>

<Panel {id}>
	<div class="p-2 grid grid-rows-[min-content_min-content_1fr] h-full gap-2">
		<ButtonGroup divClass="w-full grid grid-cols-2">
			<Button on:click={() => tab = 'entities'}><DrawSquareSolid size="md" /> Entities</Button>
			<Button on:click={() => tab = 'systems'}><CogSolid size="md" /> Systems</Button>
		</ButtonGroup>

		<ButtonGroup>
			<InputAddon><SearchOutline /></InputAddon>
			<Input on:input={updateNameFilters} />

			<Button class="!p-2"
				><FilterOutline class="w-6 h-6" />
				<Dropdown>
					{#each Registry.GetRegisteredComponentTypes() as componentType}
						<DropdownItem>
							{componentType.name}
						</DropdownItem>
					{/each}
				</Dropdown>
			</Button>
		</ButtonGroup>

		<div class="overflow-y-scroll">
			{#if tab === 'entities'}
				<List tag="ul" list="none">
					{#each filteredEntites as entity}
						<TreeNode node={entity} />
					{/each}
				</List>
			{:else}
				<List tag="ul" list="none">
					{#each systems as system}
						<TreeNode node={system} />
					{/each}
				</List>
			{/if}
		</div>
	</div>
</Panel>
