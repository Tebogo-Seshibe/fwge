import { AnimationSystem } from "@fwge/animation"
import { Game, RenderSystem, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"

export class LoadingScreen extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [
                // FullScreen
            ],    
            systems: [
                InputSystem,
                RenderSystem,
                AnimationSystem,
            ]
        })
    }
}
