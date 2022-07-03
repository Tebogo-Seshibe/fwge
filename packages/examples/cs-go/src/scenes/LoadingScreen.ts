import { AnimationSystem } from "@fwge/animation"
import { Game, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MeshRenderSystem } from "@fwge/render"

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
                MeshRenderSystem,
                AnimationSystem,
            ]
        })
    }
}
