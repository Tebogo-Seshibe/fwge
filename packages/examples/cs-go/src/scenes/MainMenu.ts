import { AnimationSystem } from "@fwge/animation"
import { Game, RenderSystem, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { FullScreen } from "../entities/FullScreen"

export class MainMenu extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [
                
            ],
            entities: [
                FullScreen
            ],
            systems: [
                InputSystem,
                RenderSystem,
                AnimationSystem,
            ]
        })
    }
}
