import { Vector3, Vector3Array } from "@fwge/common"
import { AreaLight, BasicLitMaterial, DeferredRenderSystem, DirectionalLight, Entity, Game, Mesh, MeshRenderer, PointLight, RenderMode, RenderPipelineMode, RenderType, RenderWindow, Scene, Script, ScriptSystem, Shader, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { FPSController } from "../entities"
import { FullScreen } from "../entities/FullScreen"
import { Platform } from "../entities/Platform"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"

export class MyWindow extends RenderWindow
{
    constructor(scene: Scene)
    {
        super(scene,
        {
            resolution: [scene.Game.Width, scene.Game.Height],
            renderPipelineMode: RenderPipelineMode.DEFERRED
        })
    }
}

export class PhysicsTest extends Scene
{
    x: number = 0
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ MyWindow ],
            entities: [
                FullScreen,
                FPSController,
                Platform
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                DeferredRenderSystem,
                FPSCounterSystem,
            ],
        })
    }

    override Init(): void
    {
        const scene = this
        const cubeCollider = new CubeCollider({ })
        const material = new BasicLitMaterial(
        {
            shininess: 255,
            colour: [116/255, 163/255, 202/255],
            shader: this.Game.GetAsset('Basic Shader', Shader)!,
            renderType: RenderType.OPAQUE,
            alpha: 1.0
        })
        material.Colour.Set(1.0)
        const simpleMaterial = new BasicLitMaterial(
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
        })
        const cubeRenderer = new MeshRenderer(
        {
            asset: this.Game.GetAsset('Cube', Mesh)!,
            renderMode: RenderMode.FACE
        })
        const sphereRender = new MeshRenderer(
        {
            asset: this.Game.GetAsset('OBJ Sphere', Mesh)!
        })
        const sphereRotator = new Script(
        {
            update()
            {
                const entity = this as Entity
                const transform = entity.GetComponent(Transform)!
                let x = scene.x * ((transform.Id % 7) + 1) / 5
                if (transform.Id % 2 === 0)
                {
                    transform.Position.X = Math.cos(x)
                    transform.Position.Z = Math.sin(x)
                }
                else
                {
                    x = 360 - (x % 360)
                    transform.Position.X = Math.cos(-x)
                    transform.Position.Z = Math.sin(-x)
                }
            }
        })
        const jumpingCube = new Script(
        {
            update()
            {
                const entity = this as Entity
                const transform = entity.GetComponent(Transform)!
                let x = (scene.x + entity.Id % 11) * ((transform.Id % 7) + 1) / 5
                if (transform.Id % 2 === 0)
                {
                    transform.Position.Y = Math.sin(x) + 2.0
                }
                else
                {
                    x = 360 - (x % 360)
                    transform.Position.Y = Math.sin(-x) + 2.0
                }
            }
        })

        const positions = []
        const min = -24
        const max = 24
        for (let x = min; x <= max; x+=2)
        {
            for (let z = min; z <= max; z+=2)
            {
                positions.push([x, 1, z])
            }
        }

        let i = 0
        for (const position of positions)
        {
            const cube = this.CreateEntity()
                .AddComponent(cubeCollider)
                .AddComponent(material)
                .AddComponent(new Transform({ position: position as Vector3Array }))
                .AddComponent(cubeRenderer)
                .AddComponent(jumpingCube)

            const light = this.CreateEntity()
                .AddComponent(new Transform({ position: Vector3.Add(position as Vector3Array, [0, 1, 5]), scale: [0.5, 0.5, 0.5] }))
                .AddComponent(sphereRotator)

            if (i++ % 3 === 0)
            {
                light.AddComponent(new PointLight({ 
                    colour: [Math.random(), Math.random(), Math.random()],
                    intensity: 1,
                    radius: 2
                }))
            }
            else
            {
                light.AddComponent(sphereRender).AddComponent(simpleMaterial)
            }
                
            cube.AddChild(light)
        }
        this.CreateEntity()
            .AddComponent(new AreaLight(
            {
                skyBox: { source: '/img/clouds.jpg' },
                colour: [1, 1, 1],
                intensity: 0.15
            }))

        this.CreateEntity()
            .AddComponent(new Transform({ rotation: [90, 0, 0] }))
            .AddComponent(new DirectionalLight(
            {
                intensity: 0.15,
            }))
            .AddComponent(new Script({
                update(delta) {
                    const entity = this as Entity
                    const transform = entity.GetComponent(Transform)!
                    transform.Rotation.X += delta * 50
                },
            }))

        super.Init()
    }

    override Update(delta: number): void
    {    
        this.x += delta * 5
        super.Update(delta)
    }
}