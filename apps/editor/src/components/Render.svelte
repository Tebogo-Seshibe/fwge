<script lang="ts">
	import { onMount } from "svelte";
	import { Project } from "../fwge-logic/Project";
	import { projectStore } from "../stores/project.store";
	import Panel from "./Panel.svelte";

    export let name: string;

	let canvas: HTMLCanvasElement;
	let height: number = 1080;
	let width: number = 1920;

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
    <canvas bind:this={canvas} id="canvas" on:contextmenu|preventDefault={() => void 0 } on:click|preventDefault={() => void 0} />
</Panel>

<style>
	canvas {
		position: relative;
		width: 100%;
		height: calc(100% - 28px);
	}
</style>