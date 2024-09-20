<script lang="ts">
	import { Component, Entity, Game, System, type Class, type Scene } from '@fwge/core';
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
	import { CogSolid, DrawSquareSolid, FilterOutline } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { writable, type Unsubscriber } from 'svelte/store';
	import { currentGameStore, currentSceneStore } from '../../stores/project.store';
	import Panel from '../Panel.svelte';
	import TreeNode from '../TreeNode.svelte';

	export let id: string;

    let game: Game | undefined;
	let scene: Scene | undefined;
	let systems: System[] = [];
	let entities: Entity[] = [];
    let filteredEntites: Entity[] = [];
    let componentTypes: readonly Class<Component>[] = [];
	let tab: 'entities' | 'systems' = 'entities';
    
	let filters = writable({
		components: [] as Class<Component>[],
		systems: [] as Class<System>[],
		name: ''
	});
    
    let gameUnsubcriber: Unsubscriber;
    let currentSceneUnsubcriber: Unsubscriber;

    //#region Lifetime
    onMount(() => {
        gameUnsubcriber = currentGameStore.subscribe((currentGame) => {
            game = currentGame;

            if (!game) {
                scene = undefined;
                entities = [];
                filters.set({ components: [], systems: [], name: '' });
                return;
            }
            
            componentTypes = game!.GetRegisteredComponentTypes();
        });

        currentSceneUnsubcriber = currentSceneStore.subscribe(currentScene => {
            scene = currentScene;
            
            if (!scene) {
                return;
            }

            entities = scene.Entities.map(x => game!.GetEntity(x)!);
            console.log(entities)
            filters.set({components:[], systems:[], name: ''})
        })

    });
    
    onDestroy(() => {
        if(gameUnsubcriber) {
            gameUnsubcriber();
        }

        if(currentSceneUnsubcriber) {
            currentSceneUnsubcriber();
        }
    });
    //#endregion

    //#region Events    
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
    //#endregion

    //#region Helpers
	filters.subscribe((updatedFilters) => {
		const name = updatedFilters.name.toLocaleLowerCase().trim();

		filteredEntites = entities
			.filter((entity) => entity.HasComponents(...updatedFilters.components))
			.filter((entity) => {
				return (
					name.length === 0 ||
					entity.Name.toLocaleLowerCase().includes(name) ||
					(entity as Object).constructor.name.toLocaleLowerCase().includes(name)
				);
			});
	});
    //#endregion
</script>

<Panel {id}>
	<div class="p-2 grid grid-rows-[min-content_min-content_1fr] h-full gap-2">
		<ButtonGroup divClass="w-full grid grid-cols-2">
			<Button on:click={() => tab = 'entities'}><DrawSquareSolid size="md" /> Entities</Button>
			<Button on:click={() => tab = 'systems'}><CogSolid size="md" /> Systems</Button>
		</ButtonGroup>

		<ButtonGroup>
			<InputAddon>🔎︎</InputAddon>
			<Input on:input={updateNameFilters} />

			<Button class="!p-2"
				><FilterOutline class="w-6 h-6" />
				<Dropdown>
					{#each componentTypes as componentType}
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
