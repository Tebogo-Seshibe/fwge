import { Vector3Array } from "@fwge/common";
import { AreaLight, BasicLitMaterial, DeferredRenderSystem, DirectionalLight, Entity, Game, Mesh, MeshRenderer, PointLight, RenderPipelineMode, RenderType, RenderWindow, Scene, Script, ScriptSystem, Shader, Transform } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { CubeCollider } from "@fwge/physics";
import { FPSController } from "../entities";
import { FullScreen } from "../entities/FullScreen";
import { Platform } from "../entities/Platform";
import helipad_obj from '/public/objects/helipad/helipad.obj?raw';
import helipad_mtl from '/public/objects/helipad/helipad.mtl?raw';
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io";
import { SponzaOBJ } from "../prefabs";

export class MyWindow extends RenderWindow
{
    constructor(scene: Scene)
    {
        super(scene,
            {
                resolution: [scene.Game.Width, scene.Game.Height],
                renderPipelineMode: RenderPipelineMode.DEFERRED
            });
    }
}

export class PhysicsTest extends Scene
{
    x: number = 0;
    constructor(game: Game)
    {
        super(game,
            {
                windows: [MyWindow],
                entities: [
                    FullScreen,
                    FPSController,
                    Platform
                ],
                systems: [
                    InputSystem,
                    ScriptSystem,
                    DeferredRenderSystem,
                ],
            });
    }

    override Init(): void
    {
        const scene = this;
        const cubeCollider = new CubeCollider();
        const material = new BasicLitMaterial(
            {
                shininess: 255,
                colour: [116 / 255, 163 / 255, 202 / 255],
                shader: this.Game.GetAsset('Basic Shader 2', Shader)!,
                renderType: RenderType.OPAQUE,
                alpha: 1.0
            });
        material.Colour.Set(1.0, 1.0, 1.0);
        const simpleMaterial = new BasicLitMaterial(
        {
            shininess: 32,
            colour: [1, 1, 1],
            shader: new Shader(
                `#version 300 es
                #pragma vscode_glsllint_stage: vert

                layout (std140) uniform;
                precision highp float;

                layout(location = 0) in vec3 A_Position;
                layout(location = 1) in vec3 A_Normal;
                layout(location = 2) in vec2 A_UV;
                layout(location = 3) in vec3 A_Colour;

                struct Vertex
                {
                    vec3 Position;
                    vec3 Normal;
                    vec2 UV;
                    vec3 Colour;
                };
                out Vertex V_Vertex;

                uniform Object
                {
                    mat4 ModelViewMatrix;
                    mat3 NormalMatrix;
                } object;

                uniform Camera
                {
                    mat4 ViewMatrix;
                    mat4 ProjectionMatrix;
                } camera;

                void main(void)
                {
                    V_Vertex.Position = (object.ModelViewMatrix * vec4(A_Position, 1.0)).xyz;
                    V_Vertex.Normal = normalize(object.NormalMatrix * A_Normal);
                    V_Vertex.UV = A_UV;
                    V_Vertex.Colour = A_Colour;

                    gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * vec4(V_Vertex.Position, 1.0);
                }
                `,
                `#version 300 es
                #pragma vscode_glsllint_stage: frag
                
                precision highp float;
                precision highp sampler2D;

                layout (std140) uniform;
                layout(location = 0) out vec3 O_Position;
                layout(location = 1) out vec3 O_Normal;
                layout(location = 2) out vec4 O_DiffuseSpecular;

                struct Vertex
                {
                    vec3 Position;
                    vec3 Normal;
                    vec2 UV;
                    vec3 Colour;
                };
                in Vertex V_Vertex;

                uniform BasicLitMaterial
                {
                    vec3 Colour;
                    float Shininess;
                    float Alpha;

                    vec3 Ambient;
                    vec3 Diffuse;
                    vec3 Specular;

                    bool HasImageMap;
                    bool HasBumpMap;
                    bool ReceiveShadows;
                } basicLitMaterial;

                void main(void)
                {
                    O_Position = V_Vertex.Position;
                    O_Normal = normalize(V_Vertex.Normal);
                    O_DiffuseSpecular = vec4(basicLitMaterial.Colour, basicLitMaterial.Alpha);
                }

            `),
            renderType: RenderType.OPAQUE,
            alpha: 0.1,
            receiveShadows: false,
            projectShadows: true
        });
        const cubeRenderer = new MeshRenderer({ asset: this.Game.GetAsset('Cube', Mesh)! });
        const sphereRender = new MeshRenderer({ asset: this.Game.GetAsset('OBJ Sphere', Mesh)! });
        const sphereRotator = new Script(
            {
                update()
                {
                    const entity = this as Entity;
                    const transform = entity.GetComponent(Transform)!;
                    let x = scene.x * ((transform.Id % 7) + 1) / 5;
                    transform.Position.X = Math.cos(x);
                    transform.Position.Z = Math.sin(x);
                }
            });

        const positions: Vector3Array[] = [];
        const min = -4;
        const max = 4;
        for (let x = min; x <= max; x += 2)
        {
            for (let z = min; z <= max; z += 2)
            {
                positions.push([x, 1, z]);
            }
        }

        let i = 0;
        for (const position of positions)
        {
            const cube = this.CreateEntity()
                .AddComponent(new Transform({ position: position as Vector3Array }))
                .AddComponent(cubeCollider)
                .AddComponent(material)
                .AddComponent(cubeRenderer);

            const light = this.CreateEntity()
                .AddComponent(new Transform({ scale: [0.25, 0.25, 0.25] }))
                .AddComponent(sphereRender)
                .AddComponent(simpleMaterial)
                .AddComponent(sphereRotator);

            if (i++ % 2 === 0)
            {
                light.AddComponent(new PointLight(
                {
                    colour: [Math.random(), Math.random(), Math.random()],
                    intensity: 0.15,
                    castShadows: false,
                    radius: 5
                }));
            }

            cube.AddChild(light);
        }

        this.CreateEntity()
            .AddComponent(new AreaLight(
                {
                    skyBox: { source: '/img/clouds.jpg' },
                    colour: [1, 1, 1],
                    intensity: 0.15
                }));

        this.CreateEntity()
            .AddComponent(new Transform({ rotation: [ 30, 0, 0 ] }))
            .AddComponent(new DirectionalLight({ intensity: 0.15, bias: 0.02, pcfLevel: 3, castShadows: true }));
            
        // OBJMTLPrefabBuilder(OBJLoader(helipad_obj), MTLLoader(helipad_mtl, this.Game.GetAsset('Basic Shader 2', Shader)!))
        SponzaOBJ(this.Game).Instance(this)
        super.Init();
    }

    override Update(delta: number): void
    {
        this.x += delta * 5;
        super.Update(delta);
    }
}
