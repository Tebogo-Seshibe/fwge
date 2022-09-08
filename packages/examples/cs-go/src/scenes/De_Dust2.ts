import { Game, RenderSystem, Scene, ScriptSystem, Shader } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from '@fwge/io'
import { FPSController } from "../entities"
import { FullScreen } from "../entities/FullScreen"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"
import de_dust2_MTL from '/public/objects/de_dust2_mat/de_dust2.mtl?raw'
import de_dust2_OBJ from '/public/objects/de_dust2_mat/de_dust2.obj?raw'

export class De_Dust2 extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                FPSController,
                OBJMTLPrefabBuilder(
                    OBJLoader(de_dust2_OBJ),
                    MTLLoader(de_dust2_MTL, game.GetAsset('Basic Shader', Shader))
                )
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
