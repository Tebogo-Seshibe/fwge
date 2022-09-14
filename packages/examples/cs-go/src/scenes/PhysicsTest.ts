import { BasicLitMaterial, DefaultWindow, Game, Prefab, RenderSystem, RenderType, Scene, ScriptSystem, Shader, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { PhysicsSystem } from "@fwge/physics"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"

export class PhysicsTest extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ DefaultWindow ],
            entities: [ ],
            systems: [
                InputSystem,
                ScriptSystem,
                PhysicsSystem,
                RenderSystem,
                FPSCounterSystem
            ]
        })
    }

    override Init(): void
    {
        const material = new BasicLitMaterial(
        {
            shininess: 32,
            colour: [ Math.random(), Math.random(), Math.random() ],
            shader: this.Game.GetAsset('Basic Shader', Shader)!,
            renderType: RenderType.TRANSPARENT,
            alpha: 0.5
        })
        const cubePrefab = new Prefab()
        cubePrefab.AddComponent(new Transform())
        cubePrefab.AddComponent(material)
        cubePrefab
        
        super.Init()
    }
}
