import { Game, RenderSystem, RenderWindow, Scene, ScriptSystem } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { FPSController } from "../entities"
import { Cube } from "../entities/Cube"
import { FullScreen } from "../entities/FullScreen"
import { ACESToneMapping } from "../post-process/ACESToneMapping"
import { Blur } from "../post-process/Blur"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"

export class ModernWarfare extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [
                new RenderWindow({
                    offset: [-0.5, 0.0],
                    resolution: [1920/2, 1080],
                    scale: [0.5, 1.0],
                    pipeline: [
                        ...Blur(RenderWindow.MainPassName, 'MyBlur'),
                        new ACESToneMapping(1920, 1080, 'MyBlur', 'ACES')
                    ]
                }),
                new RenderWindow({
                    offset: [0.5, 0.0],
                    resolution: [1920/2, 1080],
                    scale: [0.5, 1.0],
                })
            ],
            entities: [
                FullScreen,
                FPSController,
                ...new Array(100).fill(Cube)
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                FPSCounterSystem
            ]
        })
    }
}
