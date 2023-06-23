<script lang="ts">
    import { Project } from "../fwge-logic/Project";
    import { onMount } from "svelte";

    let height: number = 1080;
    let width: number = 1920;
    let canvas: HTMLCanvasElement;
    let project: Project;

    onMount(() => {
        project = new Project({
            canvas,
            height,
            width,
            prefabs: [],
            assets: [],
            components: [],
        });
        project.Start({ seconds: 5 });
        project.Stop({ seconds: 10 });

        console.log({ project, canvas });
    });
    
</script>

<canvas 
    bind:this={canvas}
    height={height}
    width={width}
    id="canvas"
></canvas>

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