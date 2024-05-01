<script lang="ts">
	import { window } from '@tauri-apps/api';
	import { onMount } from 'svelte';
	import { Project } from '../../fwge-logic/Project';

	let height: number = 1080;
	let width: number = 1920;
	let canvas: HTMLCanvasElement;
	let project: Project;

	onMount(async () => {
        window.getCurrent().once('', event => {
            
        })
        console.log(window.getAll().map(async x => x.isVisible()))
		project = new Project({
			canvas,
			height,
			width,
			prefabs: [],
			assets: []
		});
		project.Start({ seconds: 5 });
		project.Stop({ seconds: 10 });

		console.log({ project, canvas });
	});
</script>

<canvas bind:this={canvas} {height} {width} id="canvas" />

<style>
	#canvas {
		display: block;
		position: relative;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
</style>
