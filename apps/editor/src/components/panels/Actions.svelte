<script lang="ts">
	import type { Game, Scene, SceneId } from '@fwge/core';
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
	let currentScene: Scene | undefined;
	let scenes: SelectOptionType<SceneId>[] = [];

    let gameUnsubcriber: Unsubscriber;

    //#region Lifetime
    onMount(() => {
        gameUnsubcriber = currentGameStore.subscribe(currentGame => {
            if (!currentGame) {
                return;
            }

            game = currentGame;
            scenes = game.Scenes.map(scene => ({
                name: scene.Name,
                value: scene.Id
            }));
        })        
    })

    onDestroy(() => {
        if(gameUnsubcriber) {
            gameUnsubcriber();
        }
    });
    //#endregion

    //#region Events
    function changeScene(sceneId: SceneId) {
        if (game) {
            game.Stop();
            game.SetScene(sceneId);
            currentScene = game.GetScene(sceneId)
            currentSceneStore.set(currentScene);
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
				<Select size="sm" items={scenes} bind:value={currentScene} on:change={e => changeScene(+e.target.value)}/>
			</Label>
		</ToolbarGroup>

		<ToolbarGroup>
			<ToolbarButton on:click={play} color="dark"><PlaySolid /></ToolbarButton>
			<ToolbarButton on:click={stop} color="dark"><StopSolid /></ToolbarButton>
		</ToolbarGroup>
	</Toolbar>
</Navbar>
