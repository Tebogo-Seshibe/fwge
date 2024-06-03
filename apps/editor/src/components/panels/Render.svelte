<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { Project } from "../../fwge-logic/Project";
	import { projectStore } from "../../stores/project.store";
	import Panel from "./Panel.svelte";
	import { GL } from "@fwge/common";

    export let name: string;

	let project: Project;
	let canvas: HTMLCanvasElement;
	let height: number = 1080;
	let width: number = 1920;

	onMount(async () => {
		project = new Project({
			canvas,
			height,
			width,
			prefabs: [],
			assets: []
		});
		project.Start();

        projectStore.set(project);
		window.addEventListener('resize', resize)
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

		// console.log((GL.canvas as HTMLCanvasElement).getBoundingClientRect())
		// project.Width = (GL.canvas as HTMLCanvasElement).getBoundingClientRect().width;
		// project.Height = (GL.canvas as HTMLCanvasElement).getBoundingClientRect().height;
		project.Width = 1920; //(GL.canvas as HTMLCanvasElement).getBoundingClientRect().width;
		project.Height = 1080; //(GL.canvas as HTMLCanvasElement).getBoundingClientRect().height;
	}
</script>

<Panel {name}>
    <canvas 
		id="canvas"
		bind:this={canvas}
		on:click|preventDefault={() => void 0}
		on:contextmenu|preventDefault={() => void 0}
	/>
</Panel>

<style>
	canvas {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>