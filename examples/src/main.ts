import { AudioPlayer } from '@fwge/audio'
import { Game, Scene, Script, ScriptSystem, Tag, Transform } from "@fwge/core"
import { Input, InputSystem } from '@fwge/input'
import { Collider, PhysicsSystem, RigidBody } from "@fwge/physics"
import { Camera, Material, Mesh, PointLight, RenderSystem, Shader } from '@fwge/render'
import { configureAudios, configureMaterials, configureMeshes, configureScripts, configureShaders } from './config'
import { cameraControlScene, physicsInput, sidescrollerScene } from './scenes'
import { FrameCounter } from './shared/FrameCounter'
import './style.css'

const fpsCounter = document.querySelector<HTMLDivElement>('#fpsCounter')!
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

declare global
{
    interface Window
    {
        game: Game
    }
}

const game: Game = new Game(
{
    canvas: canvas,
    components:
    [
      Transform,
      Mesh,
      Material,
      Shader,
      Tag,
      Script,
      PointLight,
      Camera,
      Input,
      RigidBody,
      Collider,
      AudioPlayer
    ],
    systems: 
    [
      InputSystem,
      ScriptSystem,
      RenderSystem,
      FrameCounter,
      PhysicsSystem
    ],
    libraries:
    [
      Mesh,
      Material,
      Shader,
      Script,
      AudioPlayer
    ]
})

configureAudios(game)
configureShaders(game)
configureMeshes(game)
configureMaterials(game)
configureScripts(game)

// const cameraControl: Scene = cameraControlScene(game, fpsCounter)
// const sidescroller: Scene = sidescrollerScene(game, fpsCounter)
const physics: Scene = physicsInput(game, fpsCounter)

game.SetActiveScene(physics)
game.Start()

window.game = game
