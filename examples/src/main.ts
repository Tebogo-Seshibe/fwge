import './style.css'
import { Game, Scene, Script, Tag, Transform } from "@fwge/core"
import { Input } from '@fwge/input'
import { Camera, Material, Mesh, PointLight, Shader } from '@fwge/render'
import { configureMaterials, configureMeshes, configureScripts, configureShaders } from './config'
import { cameraControlScene, sidescrollerScene } from './scenes'

const fpsCounter = document.querySelector<HTMLDivElement>('#fpsCounter')!
declare global
{
    interface Window
    {
        game: Game
    }
}

const game: Game = new Game(
{
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
        Input
    ],
    libraries:
    [
        Mesh,
        Material,
        Shader,
        Script
    ]
})

configureShaders(game)
configureMeshes(game)
configureMaterials(game)
configureScripts(game)

const cameraControl: Scene = cameraControlScene(game, fpsCounter)
const sidescroller: Scene = sidescrollerScene(game, fpsCounter)

const changeScene = (id: number) =>
{
    game.Stop()
    switch (id)
    {
        case 0:
            game.SetActiveScene(cameraControl)
            break
            
        case 1:
            game.SetActiveScene(sidescroller)
            break
    }
    game.Start()
}
const buttons = document.querySelectorAll<HTMLButtonElement>('.button')
buttons.forEach((el, index) => el.addEventListener('click', () => changeScene(index)))

game.SetActiveScene(cameraControl)
game.Start()

window.game = game