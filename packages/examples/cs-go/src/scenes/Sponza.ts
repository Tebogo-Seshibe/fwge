import { Game, RenderSystem, Scene, ScriptSystem, Shader, Tag, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io"
import { FPSController } from "../entities"
import { FullScreen } from "../entities/FullScreen"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"
import sponzaMTL from '/public/objects/sponza/sponza.mtl?raw'
import sponzaOBJ from '/public/objects/sponza/sponza.obj?raw'

export class Sponza extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                FPSController,
                OBJMTLPrefabBuilder(
                    OBJLoader(sponzaOBJ),
                    MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', Shader))
                ).AddComponent(new Tag('Sponza'))
                .AddComponent(new Transform({scale: [2,2,2]}))
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
