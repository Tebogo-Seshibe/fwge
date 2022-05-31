import { FWGEGame, Game } from '@fwge/core'
import { createCube } from './components'
import { basicAnimation } from './components/Animations'
import { createBasicMaterial } from './components/Materials'
import { Credits, LoadingScreen, MainMenu, Round } from './scenes'

@FWGEGame(
{
    canvas: () => document.querySelector<HTMLCanvasElement>('#canvas')!,
    scenes: [
        MainMenu,
        LoadingScreen,
        Credits,
        Credits,
        Round
    ],
    library: [
        ['Cube', createCube],
        ['CubeMaterial', createBasicMaterial],
        ['PlaneMaterial', createBasicMaterial],
        ['BasicAnimation', basicAnimation],
    ]
})
export class CSGO extends Game { }
