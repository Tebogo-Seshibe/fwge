<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../../app.css';
	import Actions from "../../components/panels/Actions.svelte";
	import Browser from "../../components/panels/Browser.svelte";
	import Console from "../../components/panels/Console.svelte";
	import Hierarchy from "../../components/panels/Hierarchy.svelte";
	import Inspector from "../../components/panels/Inspector.svelte";
	import Render from "../../components/panels/Render.svelte";
	import { registerListeners } from '../../utils/menu/events';
	import type { UnlistenFn } from '@tauri-apps/api/event';

    let unlistens: UnlistenFn[] = [];

    onMount(async () => {
        unlistens = await registerListeners();
    });

    onDestroy(() => {
        if (unlistens.length === 0) {
            return;
        }

        for (const unlisten of unlistens) {
            unlisten();
        }
    });
</script>

<div id="editor">
    <Actions id="Actions"/>
    <Browser id="Browser"/>
    <Console id="Console"/>
    <Hierarchy id="Hierarchy"/>
    <Inspector id="Inspector"/>
    <Render id="Render"/>
</div>

<style>
    #editor {
        display: grid;
        grid-template-columns: 350px 1fr 350px;
        grid-template-rows: 75px 1fr 100px 250px;
        grid-template-areas: 
            "actions actions actions"
            "hierarchy render inspector"
            "browser render inspector"
            "browser console inspector";
        height: 100dvh;
        width: 100dvw;
        background: #444444;
        gap: 1px;
    }
    :global(#Actions) {
        grid-area: actions;
    }
    :global(#Console) {
        grid-area: console;
    }
    :global(#Inspector) {
        grid-area: inspector;
    }
    :global(#Browser) {
        grid-area: browser;
    }
    :global(#Hierarchy) {
        grid-area: hierarchy;
    }
    :global(#Render) {
        position: relative;
        grid-area: render;
    }
</style>
