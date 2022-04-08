import { AudioPlayer } from '@fwge/audio'
import { Game, Scene, Script, ScriptSystem, Tag, Transform } from "@fwge/core"
import { Input, InputSystem } from '@fwge/input'
import { Collider, PhysicsSystem, RigidBody } from "@fwge/physics"
import { Camera, Material, Mesh, ParticleSpawner, ParticleSystem, PointLight, RenderSystem, Shader } from '@fwge/render'
import { physicsInput } from './scenes'
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
      AudioPlayer,
      ParticleSpawner
    ],
    systems: 
    [
      InputSystem,
      ScriptSystem,
      RenderSystem,
      FrameCounter,
      PhysicsSystem,
      ParticleSystem
    ]
})

// const cameraControl: Scene = cameraControlScene(game, fpsCounter)
// const sidescroller: Scene = sidescrollerScene(game, fpsCounter)
const physics: Scene = physicsInput(game, fpsCounter)

game.SetActiveScene(physics)
game.Start()

window.game = game
