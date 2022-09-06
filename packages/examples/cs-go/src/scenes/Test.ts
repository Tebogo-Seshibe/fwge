import { Game, RenderSystem, Scene, ScriptSystem } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Cube } from "../entities/Cube"
import { Eye } from "../entities/Eye"
import { FullScreen } from "../entities/FullScreen"
import { Platform } from "../entities/Platform"
import { ColliderRenderSystem } from "../systems/ColliderRenderSystem"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"

export class Test extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                Eye,
                Cube,
                Platform
            ],            
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                ColliderRenderSystem,
                FPSCounterSystem
            ]
        })
    }
}
