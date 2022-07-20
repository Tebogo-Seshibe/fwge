import { Game } from '@fwge/core'
import { basicShader } from './assets/Shaders'
import { createCube, mtlCube, objCube } from './components'
import { basicAnimation } from './components/Animations'
import { createBasicMaterial } from './components/Materials'
import { Credits, LoadingScreen, MainMenu, Round } from './scenes'
import { Test } from './scenes/Test'

export class CSGO extends Game
{
    constructor()
    {
        super(
        {
            canvas: () => document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: 1080,
            width: 1920,
            scenes: [
                MainMenu,
                LoadingScreen,
                Credits,
                Round,
                Test
            ],
            components: [
                { name: 'CubeMaterial', create: createBasicMaterial },
                { name: 'PlaneMaterial', create: createBasicMaterial },
                { name: 'BasicAnimation', create: basicAnimation },
                { name: 'MTL Cube', create: mtlCube },
            ],
            assets: [
                { name: 'Cube', create: createCube },
                { name: 'Basic Shader', create: basicShader },
                { name: 'OBJ Cube', create: objCube },
            ],
            startupScene: Round
        })
    }
}
