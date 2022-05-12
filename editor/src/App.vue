<script setup lang="ts">
import { onMounted, ref } from "vue";
import Header from "./components/Header.vue";
import Panel from "./components/Panel.vue";
import { Entity, Game, Scene, Transform } from '@fwge/core'
import { Camera, MeshRenderSystem } from '@fwge/render'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const canvasRef = ref<HTMLCanvasElement>()!
const gameRef = ref<Game>(new Game())

let game: Game
let editorScene: Scene
let editorCamera: EditorCamera
class EditorCamera extends Entity
{
  public readonly camera!: Camera
  public readonly transform!: Transform

  constructor(scene: Scene)
  {
    super(scene)

    this.transform = new Transform(
    {
      position: [0,1,0],
      rotation: [30,0,0]
    })
    this.camera = new Camera()

    this.AddComponent(this.transform)
    this.AddComponent(this.camera)
    
    Camera.Main = this.camera
  }
}

onMounted(() => 
{
  if (gameRef.value && canvasRef.value)
  {
    game = gameRef.value as Game

    game.SetCanvas(canvasRef.value!)
    editorScene = game.CreateScene()
    editorScene.UseSystem(new MeshRenderSystem(
      {
        min: -10,
        max: 10,
        renderGrid: true,
        step: 1,
        wireframe: false
      }))
    game.SetActiveScene(editorScene)
    game.Start()
    editorCamera = editorScene.CreateEntity(EditorCamera)    
  }

  console.log(game)
  console.log(editorScene)
})
</script>

<template>
  <Header></Header>
  <Panel :id="'0'" :title="'Viewport'">
    <canvas :ref="(el) => canvasRef! = el"></canvas>
  </Panel>
  <Panel :id="'1'" :title="'File Explorer'"></Panel>
  <Panel :id="'2'" :title="'Components'"></Panel>
  <Panel :id="'3'" :title="'Entities'"></Panel>
</template>

<style>
html,
body {
  margin: 0px;
  padding: 0px;
  border: 0px;
  display: block;
  height: 100vh;
  width: 100vw;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #272727F0;
  /* background-color: #2c3e50; */
  padding: 0px;
  margin: 0px;
  width: inherit;
  height: inherit;
}
</style>
