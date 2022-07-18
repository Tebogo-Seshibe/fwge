import { Game } from '@fwge/core'
import { basisShader } from './assets/Shaders'
import { createCube } from './components'
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
            ],
            assets: [
                { name: 'Cube', create: createCube },
                { name: 'Basic Shader', create: basisShader }
            ],
            startupScene: Round
        })
    }
}
