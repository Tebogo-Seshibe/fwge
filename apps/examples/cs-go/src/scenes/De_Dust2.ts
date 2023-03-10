import { AreaLight, DefaultWindow, DirectionalLight, Game, PointLight, RenderSystem, Scene, ScriptSystem } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { FPSController } from "../entities";
import { FullScreen } from "../entities/FullScreen";
import { DeDust2OBJ } from "../prefabs";
import { FPSCounterSystem } from "../systems/FPSCounterSystem";

export class De_Dust2 extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
                FullScreen,
                FPSController,
                DeDust2OBJ(game)
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                FPSCounterSystem,
            ],
        })
    }
    
    override Init(): void
    {
        this.CreateEntity()
            .AddComponent(new AreaLight(
            {
                skyBox: { source: '/img/clouds.jpg' },
                colour: [1, 1, 1],
                intensity: 1.00
            }))

        this.CreateEntity()
            .AddComponent(new DirectionalLight(
            {
                direction: [0, -1, 0],
                intensity: 0.75,
                colour: [1, 1, 1],
                castShadows: true,
                bias: 0.01,
                pcfLevel: 2,
                shadowResolution: 1024
            }))

        this.CreateEntity()
            .AddComponent(new PointLight(
            {
                intensity: 0.75,
                colour: [1, 1, 1],
                castShadows: true,
                radius: 2,
            }))

        super.Init()
    }
}
