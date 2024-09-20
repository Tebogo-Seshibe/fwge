<script lang="ts">
	import type { Game, SceneId } from '@fwge/core';
	import
		{
			Label,
			NavBrand,
			Navbar,
			Select,
			Toolbar,
			ToolbarButton,
			ToolbarGroup,
			type SelectOptionType
		} from 'flowbite-svelte';
	import { PlaySolid, StopSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { currentGameStore, currentSceneStore } from '../../stores/project.store';
	
    export let id: string;

	let game: Game | undefined;
	let currentScene: string | undefined;
	let scenes: SelectOptionType<SceneId>[] = [];

    let gameUnsubcriber: Unsubscriber;

    //#region Lifetime
    onMount(() => {
        gameUnsubcriber = currentGameStore.subscribe(currentGame => {
            game = currentGame;

            if (!game) {
                scenes = [];
                currentScene = undefined;
                return;
            }

            scenes = game.Scenes.map(scene => ({
                name: scene.Name,
                value: scene.Id
            }));
            console.log(game)
            console.log(scenes)
        })        
    })

    onDestroy(() => {
        if(gameUnsubcriber) {
            gameUnsubcriber();
        }
    });
    //#endregion

    //#region Events
    function changeScene(event: Event) {
        const sceneId = +(event.target as HTMLSelectElement).value;
        if (game) {
            game.Stop();
            game.SetScene(sceneId);
            
            const nextScene = game.GetScene(sceneId);
            currentScene = nextScene?.Name;
            currentSceneStore.set(nextScene);
        }
    }

	function play(): void{
		if (game && currentScene) {
			game.Start();
		}
	}

	function stop(): void {
		if (game) {
            game.Stop();   
		}
	}
    //#endregion

    //#region Helpers
    //#endregion


</script>

<Navbar id={id} class="flex flex-row bg-[#272727]">
    <NavBrand>
        FWGE
    </NavBrand>
	<Toolbar>
		<ToolbarGroup>
			<Label>
				Scene
                <select on:change={changeScene}>
                    <option value="-1">Select a scene...</option>
                    {#if scenes && scenes.length > 0}
                    {#each scenes as scene}
                    <option value={scene.value}>{scene.name}</option>
                    {/each}
                    {/if}
                </select>
			</Label>
		</ToolbarGroup>

		<ToolbarGroup>
			<ToolbarButton on:click={play} color="dark"><PlaySolid /></ToolbarButton>
			<ToolbarButton on:click={stop} color="dark"><StopSolid /></ToolbarButton>
		</ToolbarGroup>
	</Toolbar>
</Navbar>
