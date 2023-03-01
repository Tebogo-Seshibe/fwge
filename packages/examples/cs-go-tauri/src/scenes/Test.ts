import { AreaLight, BasicLitMaterial, DefaultWindow, DirectionalLight, Entity, Game, Material, RenderSystem, Scene, Script, ScriptSystem, Shader, Tag, Transform } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io";
import { FPSController } from "../entities";
import { Cube } from "../entities/Cube";
import { FullScreen } from "../entities/FullScreen";
import { Platform } from "../entities/Platform";
import { FPSCounterSystem } from "../systems/FPSCounterSystem";
import shapesMTL from '/public/objects/shapes/shapes.mtl?raw';
import shapesOBJ from '/public/objects/shapes/shapes.obj?raw';

export class Test extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                FPSController,
                OBJMTLPrefabBuilder(
                    OBJLoader(shapesOBJ),
                    MTLLoader(shapesMTL, game.GetAsset('Basic Shader', Shader))
                ).AddComponent(new Tag('Shapes'))
                .AddComponent(new Transform(
                {
                    position: [0, 4.5, 0]
                }))
                .AddComponent(new Script(
                {
                    start()
                    {
                        console.log(this);
                        (this as Entity).Children.forEach(child =>
                        {
                            const r = Math.random()
                            const g = Math.random()
                            const b = Math.random()
                            
                            const material = child.GetComponent(Material, BasicLitMaterial)!
                            material.Colour.Set(r,g,b)
                            material.ReceiveShadows = true
                        });


                    },
                    update(delta)
                    {
                        const transform = (this as Entity).GetComponent(Transform)!
                        transform.Rotation.Y += delta * 15
                        transform.Rotation.Z += delta * 25
                    }
                })),
                ...new Array(25).fill(Cube),
                Platform,
            ],            
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                // ColliderRenderSystem,
                FPSCounterSystem
            ],
            windows: [
                DefaultWindow
            ],
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
