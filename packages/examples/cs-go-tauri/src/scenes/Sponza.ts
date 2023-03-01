import { AreaLight, BasicLitMaterial, DirectionalLight, Entity, Game, Mesh, MeshRenderer, PointLight, RenderSystem, RenderType, Scene, Script, ScriptSystem, Shader, Transform } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { FPSController } from "../entities";
import { FullScreen } from "../entities/FullScreen";
import { FPSCounterSystem } from "../systems/FPSCounterSystem";
import { MyWindow } from "./PhysicsTest";

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
                MyWindow
            ],
            entities: [
                FullScreen,
                FPSController,
                
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
            update(_delta)
            {
                // (this as Entity).GetComponent(Transform)!.Rotation.Z += delta * 10
            }}
        ))
        
        let x = 0
        this.CreateEntity()
            .AddComponent(new Transform({ position: [0, 2.5, 5], scale: [0.5,0.5,0.5] }))
            .AddComponent(new MeshRenderer({ asset: this.Game.GetAsset('OBJ Sphere', Mesh)! }))
            .AddComponent(new BasicLitMaterial(
            {
                shininess: 32,
                colour: [1, 1, 1],
                shader: new Shader(`#version 300 es

                layout(location = 0) in vec3 A_Position;
                out vec3 V_Position;
                struct Matrix
                {
                    mat4 ModelView;
                    mat3 Normal;
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;
                
                void main(void)
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * vec4(A_Position, 1.0);
                }
                `,
                `#version 300 es

                precision highp float;
                
                in vec3 V_Position;
                layout (location = 0) out vec4 O_FragColour;

                struct Materials
                {
                    vec3 Colour;
                };
                uniform Materials U_Material;
                void main(void)
                {
                    O_FragColour = vec4(U_Material.Colour, 1.0);
                }
                `),
                renderType: RenderType.OPAQUE,
                alpha: 1,
                receiveShadows: false,
                projectShadows: false
            }))
            .AddComponent(new PointLight(
            {
                colour: [1, 1, 1],
                intensity: 1,
                radius: 50
            }))
            .AddComponent(new Script(
            {
                update(delta)
                {    
                    x += delta * 5

                    const entity = this as Entity
                    const transform = entity.GetComponent(Transform)!
                    transform.Position.X = Math.cos(x) * 2.5
                    transform.Position.Z = Math.sin(x) * 2.5
                }
            }))

        super.Init()
    }
}
