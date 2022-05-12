import { Game, Scene } from "@fwge/core"
import { physicsInput } from './scenes'
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

const game: Game = new Game()
game.SetCanvas(canvas)

// const cameraControl: Scene = cameraControlScene(game, fpsCounter)
// const sidescroller: Scene = sidescrollerScene(game, fpsCounter)
const physics: Scene = physicsInput(game, fpsCounter)

game.SetActiveScene(physics)
game.Start()
document.onpointerlockchange = console.log
document.onpointerlockerror = console.log
document.onfullscreenchange = console.log
document.onfullscreenerror = console.log
window.game = game
