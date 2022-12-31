import { AnimationSystem } from "@fwge/animation"
import { DefaultWindow, Game, RenderSystem, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { FullScreen } from "../entities/FullScreen"

export class MainMenu extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [
                DefaultWindow
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
