import { Game, RenderPipelineMode, RenderSystem, RenderWindow, Scene, ScriptSystem, Shader, Tag, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io"
import { FPSController } from "../entities"
import { FullScreen } from "../entities/FullScreen"
import { ACESToneMapping } from "../post-process/ACESToneMapping"
import { DeferredLighting } from "../post-process/DeferredLighting"
import { GammaCorrection } from "../post-process/GammaCorrection"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"
import sponzaMTL from '/public/objects/sponza/sponza.mtl?raw'
import sponzaOBJ from '/public/objects/sponza/sponza.obj?raw'

export class Sponza extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [
                {
                    renderPipelineMode: RenderPipelineMode.DEFERRED,
                    pipeline: [
                        new DeferredLighting(1920, 1080, RenderWindow.MainPassName, 'Lighting')
                        // new GammaCorrection(1920, 1080, RenderWindow.MainPassName, 'Gamma'),
                        // new ACESToneMapping(1920, 1080, RenderWindow.MainPassName, 'Aces')
                    ]
                }
            ],
            entities: [
                FullScreen,
                FPSController,
                OBJMTLPrefabBuilder(
                    OBJLoader(sponzaOBJ),
                    MTLLoader(sponzaMTL, game.GetAsset('Basic Shader 2', Shader))
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

    Init(): void {
        super.Init()

        const transform = this.GetEntity(11)!.GetComponent(Transform)!
        transform.Position.Set(12.5, 0, -0.5)
        transform.Rotation.Set(0, 275, 0)
    }
}
