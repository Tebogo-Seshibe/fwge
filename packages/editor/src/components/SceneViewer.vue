<script setup lang="ts">
import { Scene, ScriptSystem } from '@fwge/core'
import { InputSystem } from '@fwge/input'
import { MeshRenderSystem } from '@fwge/render'
import { onMounted, ref, VNodeRef } from 'vue'
import { getGame } from '../App.vue'
const editorScene = new (class EditorScene extends Scene{})
const canvasRef = ref<VNodeRef>()
const game = getGame()
const running = ref(false)
onMounted(() =>
{
    const canvas = canvasRef.value as any as HTMLCanvasElement
    canvas.width = 1920
    canvas.height = 1080
    
    game.ResetContext(canvas)
    game.AddScene(editorScene)
    game.SetScene(editorScene.Id)

    game.Init()
    editorScene.AddSystem(new InputSystem())
    editorScene.AddSystem(new ScriptSystem())
    editorScene.AddSystem(new MeshRenderSystem())
})
function togglePlay()
{
    if (running.value)
    {
        game.Stop()
    }
    else
    {
        game.Start()
    }
    running.value = !running.value
}
</script>
0
<template>
<div class="scene-viewer">
    <div class="scene-viewer-controls">    
        <button @click="togglePlay()"> {{ running ? '■' : '▶' }} </button>
    </div>

    <canvas ref="canvasRef"></canvas>
</div>
</template>

<style scoped>
.scene-viewer {
    display: flex;
    flex-direction: column;

    height: 800px;
    width: calc(100% - 700px);

    background: var(--tertiary);
    
    box-shadow: 0px 0px 8px black;
    padding: 0px 20px;
    margin: 0px 25px;
}
.scene-viewer-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;

    height: 50px;
    padding-top: 20px;
}
.scene-viewer-controls button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    font-size: 16px;
}
canvas {
    height: calc(100% - 50px);
    max-width: 100%;
    padding-bottom: 20px;
}
</style>

