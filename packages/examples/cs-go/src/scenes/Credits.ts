import { AnimationSystem } from "@fwge/animation"
import { Game, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { RenderSystem } from "@fwge/render"


export class Credits extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [],
            systems: [
                InputSystem,
                RenderSystem,
                AnimationSystem,
            ]
        })
    }
}
