<script lang="ts">
	import type { Game } from "@fwge/core";
	import { onDestroy, onMount } from "svelte";
	import type { Unsubscriber } from "svelte/store";
	import { currentGameStore } from "../../stores/project.store";
	import Panel from "../Panel.svelte";

    export let id: string;

	let game: Game;
    let containerDiv: HTMLDivElement;
    let gameUnsubcriber: Unsubscriber;

	onMount(async () => {
        gameUnsubcriber = currentGameStore.subscribe(currentGame => {
            if (!currentGame) {
                return;
            }

            game = currentGame;
            currentGame.Canvas.id = "canvas";
            currentGame.Canvas.classList.add('cursor-crosshair');
            
            containerDiv.appendChild(game.Canvas)
            resize();

            game.Start();
        });

		window.addEventListener('resize', resize)
	});

	onDestroy(() => {
        if (gameUnsubcriber)
            gameUnsubcriber();
		window.removeEventListener('resize', resize)
        containerDiv.removeChild(game.Canvas)
	});

	function resize(): void {
		if (!game) {
			return;
		}

        game.Canvas.height = containerDiv.clientHeight;
        game.Canvas.width = containerDiv.clientWidth;
	}
</script>

<Panel {id}>
    <div 
        bind:this={containerDiv} 
        class='h-full w-full' 
        on:resize={resize}
    ></div>
</Panel>