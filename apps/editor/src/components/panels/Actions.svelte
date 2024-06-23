<script lang="ts">
	import type { Game, Scene } from '@fwge/core';
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
	import { FwgeDbContext } from '../../stores/fwgeDbContext';
	import { currentProjectStore, currentSceneIdStore } from '../../stores/project.store';
	import { Entity } from '@fwge/ecs';
	export let id: string;

	let db: FwgeDbContext;
	let game: Game | undefined;
	let currentScene: Scene | undefined;
	let scenes: SelectOptionType<Scene>[] = [];

    let currentSceneUnsubcriber: Unsubscriber;
    let projectUnsubcriber: Unsubscriber;

    onMount(async () => {
        try {
            db = new FwgeDbContext();
			await db.connect();
		} catch (e) {
			console.error(e);
		}

        console.log(new Entity())
        console.log(Entity)
        
        projectUnsubcriber = currentProjectStore.subscribe(p => {
            // game = g;

            // if (game) {
            //     scenes = g.Scenes.map((x) => ({
            //         name: x.Name,
            //         value: x
            //     }));
            // }
            console.log(p)
        });
        
        currentSceneUnsubcriber = currentSceneIdStore.subscribe(currentSceneId => {
            currentScene = game?.GetScene(currentSceneId);
        });
    })

    onDestroy(() => {
        db.disconnect();
        currentSceneUnsubcriber();
        projectUnsubcriber();
    });


	async function play(): Promise<void> {
		// if (project && currentScene) {
		// 	project.SetScene(currentScene.Id);
		// }
	}

	function stop(): void {
		if (game) {
            game.Stop();   
		}
	}
</script>

<Navbar id={id} class="flex flex-row bg-[#272727]">
    <NavBrand>
        FWGE
    </NavBrand>
	<Toolbar>
		<ToolbarGroup>
			<Label>
				Scene
				<Select size="sm" items={scenes} bind:value={currentScene} />
			</Label>
		</ToolbarGroup>

		<ToolbarGroup>
			<ToolbarButton on:click={play} color="dark"><PlaySolid /></ToolbarButton>
			<ToolbarButton on:click={stop} color="dark"><StopSolid /></ToolbarButton>
		</ToolbarGroup>
	</Toolbar>
</Navbar>
