import { AnimationSystem } from "@fwge/animation"
import { Game, RenderSystem, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"


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
