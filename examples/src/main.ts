import './style.css'
import { Game, Script, Tag, Transform } from "@fwge/core"
import { Input } from '@fwge/input'
import { Camera, Material, Mesh, PointLight, Shader } from '@fwge/render'
import { configureMaterials, configureMeshes, configureScripts, configureShaders } from './config'
import { cameraControlScene, sidescrollerScene } from './scenes'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const fpsCounter = document.querySelector<HTMLDivElement>('#fpsCounter')!

declare global
{
    interface Window
    {
        game: Game
    }
}

try
{
    const game = new Game(
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

    const cameraControl = cameraControlScene(game, fpsCounter)
    const sidescroller = sidescrollerScene(game, fpsCounter)

    game.SetActiveScene(cameraControl)
    // game.SetActiveScene(sidescroller)

    game.Start()
    // game.Stop({ minutes: 5 })

    canvas.ownerDocument.documentElement.addEventListener(
        'keydown', (e: KeyboardEvent) =>
        {
            switch (e.key)
            {
                case '1':
                    game.Stop()
                    game.SetActiveScene(cameraControl)
                    game.Start()
                    break
                case '2':
                    game.Stop()
                    game.SetActiveScene(sidescroller)
                    game.Start()
                    break

            }
        }
    )
    
    window.game = game
}
catch (e)
{
    console.error(e)
}
