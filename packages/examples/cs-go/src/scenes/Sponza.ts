import { AreaLight, DefaultWindow, DirectionalLight, Entity, Game, RenderSystem, Scene, Script, ScriptSystem, Shader, Tag, Transform } from "@fwge/core"
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
            // windows: [
            //     new RenderWindow({
            //         resolution: [1920, 1080],
            //         pipeline: [
            //             new ACESToneMapping(1920, 1080, RenderWindow.MainPassName, 'ACESToneMapping'),
            //         ]
            //     }),
            //     new RenderWindow({
            //         pipeline: [
            //                 new HorizontalBlur(1920 / 2, 1080 / 2, RenderWindow.MainPassName, 'HorizontalBlur'),
            //                 new VerticalBlur(1920 / 4, 1080 / 4, 'HorizontalBlur', 'VerticalBlur'),
            //                 // new Invert(1920, 1080, 'VerticalBlur', 'Invert')
            //             ],
            //         offset: [-0.88, 0.68],
            //         scale: [0.2,0.2],
            //         resolution: [1920, 1080],
            //         // camera: new OrthographicCamera()
            //     }),
            // ],
            windows: [
                DefaultWindow
            ],
            entities: [
                FullScreen,
                FPSController,
                OBJMTLPrefabBuilder(
                    OBJLoader(sponzaOBJ),
                    MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', Shader))
                )
                .AddComponent(new Tag('Sponza'))
                .AddComponent(new Transform({ scale: [5,5,5] }))
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                FPSCounterSystem
            ]
        })
    }

    Init(): void
    {
        this.CreateEntity().AddComponent(new AreaLight(
        {
            skyBox: { source: '/img/clouds.jpg' },
            colour: [1, 1, 1],
            intensity: 0.5
        }))
        this.CreateEntity().AddComponent(new DirectionalLight(
        {
            intensity: 1.0,
            colour: [1, 1, 1],
            castShadows: true
        }))
        .AddComponent(new Transform({ rotation: [90, 0, 0] }))
        .AddComponent(new Script({ 
            update(delta)
            {
                // (this as Entity).GetComponent(Transform)!.Rotation.Z += delta * 10
            }}
        ))
        

        super.Init()
    }
}
