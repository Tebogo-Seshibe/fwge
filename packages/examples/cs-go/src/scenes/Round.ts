import { Entity, Game, Prefab, Scene, Script, ScriptSystem, Tag, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io"
import { Material, MeshRenderer, Renderer, RenderMode, RenderSystem, ShaderAsset } from "@fwge/render"
import { FPSController } from "../entities"
import { Cube } from "../entities/Cube"
import { FullScreen } from "../entities/FullScreen"
import { Platform } from "../entities/Platform"
import { ColliderRenderSystem } from "../systems/ColliderRenderSystem"
import sponzaMTL from '/public/objects/sponza/sponza.mtl?raw'
import sponzaOBJ from '/public/objects/sponza/sponza.obj?raw'
import garageMTL from '/public/objects/garage/garage.mtl?raw'
import garageOBJ from '/public/objects/garage/garage.obj?raw'
import shapesMTL from '/public/objects/shapes/shapes.mtl?raw'
import shapesOBJ from '/public/objects/shapes/shapes.obj?raw'
import helipadMTL from '/public/objects/helipad/helipad.mtl?raw'
import helipadOBJ from '/public/objects/helipad/helipad.obj?raw'
import { randBetween } from "@fwge/common"

export class Round extends Scene
{
    fpsCounterDiv!: HTMLDivElement

    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                FPSController,
                Platform,
                // ...new Array(1).fill(Cube),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(shapesOBJ),
                //     MTLLoader(shapesMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Shapes'))
                // .AddComponent(new Transform(
                // {
                //     position: [0, 4.5, 0]
                // }))
                // .AddComponent(new Script(
                // {
                //     start()
                //     {
                //         (this as Entity).Children.forEach(child =>
                //         {
                //             const r = Math.random()
                //             const g = Math.random()
                //             const b = Math.random()
                            
                //             child.GetComponent(Material)!.Colour.Set(r,g,b)
                //         })
                //     },
                //     update(delta)
                //     {
                //         const transform = (this as Entity).GetComponent(Transform)!
                //         transform.Rotation.Y += delta * 15
                //         transform.Rotation.Z += delta * 25
                //     }
                // })),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(garageOBJ),
                //     MTLLoader(garageMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Garage'))
                // .AddComponent(new Transform({ position: [0, -15, 0]})),
                OBJMTLPrefabBuilder(
                    OBJLoader(helipadOBJ),
                    MTLLoader(helipadMTL, game.GetAsset('Basic Shader', ShaderAsset))
                ).AddComponent(new Tag('Helipad'))
                .AddComponent(new Transform({ position: [0, 0, 0]}))
                .AddComponent(new Script(
                {
                    start()
                    {
                        console.log(this);
                        (this as Entity).Children.forEach(child => {
                            const renderer = child.GetComponent(Renderer)
                            if (renderer)
                                renderer.RenderMode = RenderMode.FACE
                        })
                    }
                })),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(sponzaOBJ),
                //     MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Sponza'))
                // .AddComponent(new Transform({scale: [2,2,2]}))
                // .AddComponent(new Script(
                // {
                //     start()
                //     {
                //         console.log(this as Entity)
                //     }
                // })),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(sponzaOBJ),
                //     MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Sponza'))
                // .AddComponent(new Transform({position: [-50,0,0], scale: [2,2,2]})),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(sponzaOBJ),
                //     MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Sponza'))
                // .AddComponent(new Transform({position: [50,0,0], scale: [2,2,2]})),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(sponzaOBJ),
                //     MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Sponza'))
                // .AddComponent(new Transform({position: [0,0,50], scale: [2,2,2]})),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(sponzaOBJ),
                //     MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', ShaderAsset))
                // ).AddComponent(new Tag('Sponza'))
                // .AddComponent(new Transform({position: [0,0,-50], scale: [2,2,2]})),
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                // PhysicsSystem,
                RenderSystem,
                // AnimationSystem,
                // ColliderRenderSystem
            ]
        })
    }

    Init(): void {
        this.fpsCounterDiv = document.querySelector<HTMLDivElement>('#fpsCounter')!
        // const defaultShader = this.Game.GetAsset('Basic Shader', ShaderAsset)
        // const sponzaPrefab: Prefab<any> = OBJMTLPrefabBuilder(OBJLoader(sponzaOBJ), MTLLoader(sponzaMTL, defaultShader))
        // const sponza: Entity = sponzaPrefab.Instance(this)
        // sponza.GetComponent(Transform)!.Scale.Multiply(2)
        super.Init()
    }

    Update(delta: number): void
    {
        super.Update(delta)
        
        const fps = Math.round(delta === 0 ? 0 : 1 / delta)
        this.fpsCounterDiv.innerText = (fps < 10 ? '  ' + fps : fps < 100 ? ' ' + fps : fps ) + 'fps'
    }
}
