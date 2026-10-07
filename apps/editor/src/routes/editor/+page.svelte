<script lang="ts">
	import { Game } from '@fwge/core';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import '../../app.css';
	import { currentGameStore } from '../../stores/project.store';
	import { registerMenuListeners } from '../../utils/menu/events';

    let canvas: HTMLCanvasElement;
    let unlistens: UnlistenFn[] = [];
    let game: Game;
    let gameUnsubcriber: Unsubscriber;

    currentGameStore.subscribe
    onMount(async () => {
        unlistens = [
            // ...await registerMenuListeners(),
            // ...await registerEditorListeners()
        ];

        gameUnsubcriber = currentGameStore.subscribe(
            (currentGame) => {
                if (!currentGame) {
                    return;
                }

                game = currentGame;
                game.SetCanvas(canvas);
                console.log({ game })
            },
            (currentGame) => {                
                if (!currentGame) {
                    return;
                }
            }
        )
        
    });

    onDestroy(() => {
        if (gameUnsubcriber) {
            gameUnsubcriber();
        }

        for (const unlisten of unlistens) {
            unlisten();
        }
    });
</script>

<div id="editor">
    <canvas bind:this={canvas}></canvas>
    <!-- <Actions id="Actions"/>
    <Browser id="Browser"/>
    <Console id="Console"/>
    <Hierarchy id="Hierarchy"/>
    <Inspector id="Inspector"/>
    <Render id="Render"/> -->
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
