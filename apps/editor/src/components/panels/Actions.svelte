<script lang="ts">
    import Panel from "./Panel.svelte";
    import Play from 'svelte-material-icons/Play.svelte';
    import Stop from 'svelte-material-icons/Stop.svelte';
	import type { Project } from "../../fwge-logic/Project";
	import { currentSceneStore, projectStore } from "../../stores/project.store";
	import { EditorSceneId } from "../../fwge-logic/scenes";
    export let name: string;

    let project: Project | undefined;
    let currentScene = -1;

    currentSceneStore.subscribe(currentSceneId => {
        currentScene = currentSceneId;
    });

    projectStore.subscribe(p => {
        project = p;
    });

    function play(): void {
        if (project) {
            project.SetScene(currentScene);
        }
    }
    
    function stop(): void {
        if (project) {
            project.SetScene(EditorSceneId);
        }
    }
</script>

<Panel {name} withHeader={false}>
    <div class="buttons">
        <button class='icon' on:click|stopPropagation={play}><Play/></button>
        <button class='icon' on:click|stopPropagation={stop}><Stop/></button>
    </div>
</Panel>

<style>
    .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: fit-content;
        margin: 0 auto;
    }
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
</style>