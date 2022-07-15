import { AnimationSystem } from "@fwge/animation"
import { Game, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { RenderSystem } from "@fwge/render"
import { FullScreen } from "../entities/FullScreen"

export class MainMenu extends Scene
{
    constructor(game: Game)
    {
        super(game, {
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
