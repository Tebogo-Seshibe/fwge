import { FWGEGame, Game } from '@fwge/core'
import { createCube } from './components'
import { basicAnimation } from './components/Animations'
import { createBasicMaterial } from './components/Materials'
import { Credits, LoadingScreen, MainMenu, Round } from './scenes'
import { Test } from './scenes/Test'

@FWGEGame(
{
    canvas: () => document.querySelector<HTMLCanvasElement>('#canvas')!,
    scenes: [
        MainMenu,
        LoadingScreen,
        Credits,
        Credits,
        Round,
        Test
    ],
    library: [
        ['Cube', createCube],
        ['CubeMaterial', createBasicMaterial],
        ['PlaneMaterial', createBasicMaterial],
        ['BasicAnimation', basicAnimation],
    ]
})
export class CSGO extends Game { }
