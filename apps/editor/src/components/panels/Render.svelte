<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { Project } from "../../fwge-logic/Project";
	import { projectStore } from "../../stores/project.store";
	import Panel from "./Panel.svelte";
	import { GL } from "@fwge/common";

    export let id: string;

	let project: Project;
    let containerDiv: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		project = new Project({
			canvas,
			height: containerDiv.clientHeight,
			width: containerDiv.clientWidth,
			prefabs: [],
			assets: []
		});
		project.Start();

        projectStore.set(project);
		window.addEventListener('resize', resize)
        // resize()
	});

	onDestroy(() => {
		window.removeEventListener('resize', resize)
	});

	function resize(): void
	{
		if (!project)
		{
			return;
		}

        canvas.height = containerDiv.clientHeight;
        canvas.width = containerDiv.clientWidth;
	}
</script>

<Panel {id}>
    <div bind:this={containerDiv} class='h-full w-full' on:resize={resize}>
        <canvas 
            id="canvas"
            bind:this={canvas}
            on:click|preventDefault={() => void 0}
            on:contextmenu|preventDefault={() => void 0}
        />
</div>
</Panel>