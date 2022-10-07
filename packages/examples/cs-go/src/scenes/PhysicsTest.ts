import { AreaLight, BasicLitMaterial, DefaultWindow, DirectionalLight, Entity, Game, Material, Mesh, MeshRenderer, PointLight, Prefab, RenderMode, RenderSystem, RenderType, Scene, Script, ScriptSystem, Shader, StaticMesh, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { ParticleSystem } from "@fwge/render"
import { FPSController } from "../entities"
import { FullScreen } from "../entities/FullScreen"
import { GameObject } from "../entities/GameObject"
import { Platform } from "../entities/Platform"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"

export class PhysicsTest extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ DefaultWindow ],
            entities: [
                FullScreen,
                FPSController,
                Platform
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                // PhysicsSystem,
                ParticleSystem,
                RenderSystem,
                // ColliderRenderSystem,
                FPSCounterSystem,
            ]
        })
    }

    override Init(): void
    {
        const cubeCollider = new CubeCollider({ })
        const material = new BasicLitMaterial(
        {
            shininess: 32,
            colour: [116/255, 163/255, 202/255],
            shader: this.Game.GetAsset('Basic Shader', Shader)!,
            renderType: RenderType.TRANSPARENT,
            alpha: 1.0
        })
        const cubePrefab = new Prefab()
        cubePrefab.AddComponent(material)
        cubePrefab.AddComponent(new MeshRenderer(
        {
            asset: this.Game.GetAsset('Cube', Mesh)!,
            renderMode: RenderMode.FACE
        }))
        
        const speed = 100
        const spin = new Script(
        { 
            update: function(delta)
            {
                (this as any as Entity).GetComponent(Transform)?.Rotation.Add(0, delta * speed, 0)
            }
        })
        const parent = this.CreateEntity(GameObject)
        parent
            // .AddComponent(spin)
            .AddComponent(new Transform(
            {
                scale: [2, 2, 2],
                rotation: [0, 0, 0],
                position: [0, 0.5000001, 0]
            }))

        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [ 0, 0,  0] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [ 2, 0,  2] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [ 2, 0, -2] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [-2, 0,  2] }))
            .AddComponent(cubeCollider)
            .Parent = parent                    
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [-2, 0, -2] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [ 4, 0,  4] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [ 4, 0, -4] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [-4, 0,  4] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        cubePrefab.Instance(this)
            .AddComponent(new Transform({ position: [-4, 0, -4] }))
            .AddComponent(cubeCollider)
            .Parent = parent
        
        let x = 0
        this.CreateEntity()
            .AddComponent(new AreaLight(
            {
                skyBox: { source: '/img/clouds.jpg' },
                colour: [1, 1, 1],
                intensity: 0.1
            }))
        this.CreateEntity()
            .AddComponent(new DirectionalLight(
            {
                intensity: 1.0,
                colour: [1, 1, 1],
                castShadows: true,
                pcfLevel: 3,
                bias: 0.005
            }))
            .AddComponent(new Transform({ rotation: [45, 0, 0] }))
            .AddComponent(new Script(
            {
                update(delta)
                {
                    const entity = this as Entity
                    const transform = entity.GetComponent(Transform)!
                    // transform.Rotation.Y += delta * speed
                }
            }))

        this.CreateEntity()
            .AddComponent(new Transform({ position: [0, 0.5, 5], scale: [0.5,0.5,0.5] }))
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
                intensity: 0.25,
                radius: 5
            }))
            .AddComponent(new Script(
            {
                update(delta)
                {    
                    x += delta * speed * 0.05

                    const entity = this as Entity
                    const transform = entity.GetComponent(Transform)!
                    transform.Position.X = Math.cos(x) * 2.5
                    transform.Position.Z = Math.sin(x) * 2.5
                }
            }))
        
        super.Init()
    }
}
