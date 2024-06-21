<script lang="ts">
	import { Game, Scene } from "@fwge/core";
	import type { Type } from "@fwge/ecs";
	import { onDestroy, onMount } from "svelte";
	import type { Unsubscriber } from "svelte/store";
	import { currentProjectStore } from "../../stores/project.store";
	import Panel from "../Panel.svelte";

    export let id: string;

	let project: Game;
    let containerDiv: HTMLDivElement;
    let projectUnsubcriber: Unsubscriber;

	onMount(async () => {
        projectUnsubcriber = currentProjectStore.subscribe(currentProject => {
            console.log(currentProject)
            if (!currentProject) {
                return;
            }
            
            const scenes: Type<Scene>[] = [];

            project = new Game({
                height: currentProject.build?.targets[0]?.height ?? 1080,
                width: currentProject.build?.targets[0]?.width ?? 1920,
                scenes,
                startupScene: 0,
            });
            console.log(project);
            project.Canvas.id = "canvas";
            project.Canvas.classList.add('cursor-crosshair');
            
            containerDiv.appendChild(project.Canvas)
            project.Start();
        });

		window.addEventListener('resize', resize)
        resize()
	});

	onDestroy(() => {
        if (projectUnsubcriber)
            projectUnsubcriber();
		window.removeEventListener('resize', resize)
	});

	function resize(): void
	{
		if (!project)
		{
			return;
		}

        project.Canvas.height = containerDiv.clientHeight;
        project.Canvas.width = containerDiv.clientWidth;
	}
</script>

<Panel {id}>
    <div 
        bind:this={containerDiv} 
        class='h-full w-full' 
        on:resize={resize}
    ></div>
</Panel>