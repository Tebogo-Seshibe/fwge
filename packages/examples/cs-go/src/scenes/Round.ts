import { AreaLight, Entity, Game, Material, RenderSystem, Scene, Script, ScriptSystem, Shader, Tag, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
// import { GLTFLoader, MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io"
import { FPSController } from "../entities"
import { FullScreen } from "../entities/FullScreen"
// import sponzaMTL from '/public/objects/sponza/sponza.mtl?raw'
// import sponzaOBJ from '/public/objects/sponza/sponza.obj?raw'
// import sponza_pbrMTL from '/public/objects/sponza_pbr/sponza_pbr.mtl?raw'
// import sponza_pbrOBJ from '/public/objects/sponza_pbr/sponza_pbr.obj?raw'
// import garageMTL from '/public/objects/garage/garage.mtl?raw'
// import garageOBJ from '/public/objects/garage/garage.obj?raw'
// import shapesMTL from '/public/objects/shapes/shapes.mtl?raw'
// import shapesOBJ from '/public/objects/shapes/shapes.obj?raw'
// import helipadMTL from '/public/objects/helipad/helipad.mtl?raw'
// import helipadOBJ from '/public/objects/helipad/helipad.obj?raw'
// import sponza_glb from '/public/objects/sponza-gltf-pbr/sponza.glb?raw'
// import ps2_gltf from '/public/objects/ps2/ps2.gltf?raw'
// import ps2_bin from '/public/objects/ps2/ps2.bin?raw'
// import cube_2_bin from '/public/objects/cube_2/cube_2.bin?raw'
// import cube_2_gltf from '/public/objects/cube_2/cube_2.gltf?raw'
// import triangle_gltf from '/public/objects/triangle/triangle.gltf?raw'
import { Platform } from "../entities/Platform"
import { Cube } from "../entities/Cube"
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
                ...new Array(1).fill(Cube),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(shapesOBJ),
                //     MTLLoader(shapesMTL, game.GetAsset('Basic Shader', Shader))
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
                //     MTLLoader(garageMTL, game.GetAsset('Basic Shader', Shader))
                // ).AddComponent(new Tag('Garage'))
                // .AddComponent(new Transform({ position: [0, -10, 0], scale: [0.5,0.5,0.5]})),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(helipadOBJ),
                //     MTLLoader(helipadMTL, game.GetAsset('Basic Shader', Shader))
                // ).AddComponent(new Tag('Helipad'))
                // .AddComponent(new Transform({ position: [0, 0, 0]}))
                // .AddComponent(new Script(
                // {
                //     start()
                //     {
                //         (this as Entity).Children.forEach(child => {
                //             const renderer = child.GetComponent(Renderer)
                //             if (renderer)
                //                 renderer.RenderMode = RenderMode.FACE
                //         })
                //     }
                // })),
                // OBJMTLPrefabBuilder(
                //     OBJLoader(sponzaOBJ),
                //     MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', Shader))
                // ).AddComponent(new Tag('Sponza'))
                // .AddComponent(new Transform({scale: [2,2,2]}))
                // .AddComponent(new Script(
                // {
                //     start()
                //     {
                //         // (this as Entity).GetComponent(Transform)!.Position.Z = -;
                //         (this as Entity).GetComponent(Transform)!.Rotation.Y = -90;
                //     }
                // })),
                // GLTFLoader(cube_2_gltf, cube_2_bin, '/public/objects/ps2').AddComponent(new Tag('Cube')),
                // GLTFLoader(triangle_gltf, game.GetAsset('Basic Shader', Shader)).AddComponent(new Tag('Triangle'))
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
        // GLTFLoader('/public/objects/helipad/helipad.mtl?raw')
        this.CreateEntity().AddComponent(new AreaLight(
        {
            colour: [1, 1, 1],
            intensity: 1.0
        }))
        super.Init()
    }

    Update(delta: number): void
    {
        super.Update(delta)
        
        const fps = Math.round(delta === 0 ? 0 : 1 / delta)
        this.fpsCounterDiv.innerText = (fps < 10 ? '  ' + fps : fps < 100 ? ' ' + fps : fps ) + 'fps'
    }
}
