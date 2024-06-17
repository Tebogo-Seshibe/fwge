<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { Project } from "../../engine/Project";
	import { projectStore } from "../../stores/project.store";
	import Panel from "../Panel.svelte";
	import { Registry } from "@fwge/ecs";
	import type { Unsubscriber } from "svelte/store";
	import { GL } from "@fwge/common";

    export let id: string;

	let project: Project;
    let containerDiv: HTMLDivElement;
	let canvas: HTMLCanvasElement;
    let projectUnsubcriber: Unsubscriber;

	onMount(async () => {
        projectUnsubcriber = projectStore.subscribe(currentProject => {
            if (currentProject) {
                project = currentProject;
            } else {
                projectStore.set(new Project({
                    height: containerDiv.clientHeight,
                    width: containerDiv.clientWidth,
                    prefabs: [],
                    assets: []
                }));
                project.Canvas.id = "canvas";
                project.Canvas.classList.add('cursor-crosshair')
            }        
        });
        
        containerDiv.appendChild(project.Canvas)
		project.Start();

		window.addEventListener('resize', resize)
        resize()
	});

	onDestroy(() => {
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