<script lang="ts">
	import { onMount } from "svelte";
	import { Project } from "../fwge-logic/Project";
	import { projectStore } from "../stores/project.store";
	import Panel from "./Panel.svelte";

    export let name: string;

	let canvas: HTMLCanvasElement;
	let height: number = 360;
	let width: number = 480;

	onMount(async () => {
		const project = new Project({
			canvas,
			height,
			width,
			prefabs: [],
			assets: []
		});
		project.Start();

        projectStore.set(project);
	});
</script>

<Panel {name}>
    
    <canvas bind:this={canvas} id="canvas" />
</Panel>

<style>

</style>