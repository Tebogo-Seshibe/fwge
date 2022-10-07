import { AreaLight, DefaultWindow, DirectionalLight, Game, RenderSystem, RenderWindow, Scene, Script, ScriptSystem, Shader, Transform } from "@fwge/core"
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
                ).AddComponent(new Transform({ position: [0, 0, 0] }))
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                FPSCounterSystem
            ],
            windows: [ DefaultWindow ]
        })
    }
    
    Init(): void
    {
        this.CreateEntity().AddComponent(new AreaLight(
        {
            skyBox: { source: '/img/clouds.jpg' },
            colour: [1, 1, 1],
            intensity: 0.25
        }))
        .AddComponent(new Script({ start: console.log }))

        this.CreateEntity().AddComponent(new DirectionalLight(
        {
            direction: [0, -1, 0],
            intensity: 0.75,
            colour: [1, 1, 1],
            castShadows: true,
            bias: 0.01,
            pcfLevel: 2,
            shadowResolution: 1024
        }))
        .AddComponent(new Script({ start: console.log }))        

        super.Init()
    }
}
