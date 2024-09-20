<script lang="ts">
	import type { Game } from "@fwge/core";
	import { onDestroy, onMount } from "svelte";
	import type { Unsubscriber } from "svelte/store";
	import { currentGameStore } from "../../stores/project.store";
	import Panel from "../Panel.svelte";

    export let id: string;

	let game: Game | undefined;
    let containerDiv: HTMLDivElement;

    let gameUnsubcriber: Unsubscriber;

    //#region Lifetime
	onMount(() => {
        gameUnsubcriber = currentGameStore.subscribe(currentGame => {
            game = currentGame;

            if (!game) {
                return;
            }

            game.Canvas.id = "canvas";
            game.Canvas.classList.add('cursor-crosshair');
            
            containerDiv.appendChild(game.Canvas)
            resize();

            game.Start();
        });

		window.addEventListener('resize', resize)
	});

	onDestroy(() => {
        if (gameUnsubcriber) {
            gameUnsubcriber();
        }

        if (game) {
            containerDiv.removeChild(game.Canvas)
        }

        window.removeEventListener('resize', resize)
	});
    //#endregion

    //#region Events
	function resize(): void {
		if (!game) {
			return;
		}

        game.Canvas.height = containerDiv.clientHeight;
        game.Canvas.width = containerDiv.clientWidth;
	}
    //#endregion
</script>

<Panel {id}>
    <div 
        bind:this={containerDiv} 
        class='h-full w-full' 
        on:resize={resize}
    ></div>
</Panel>