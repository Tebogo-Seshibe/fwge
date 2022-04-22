import { AudioPlayer } from "@fwge/audio"
import { Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { Input, InputSystem, KeyState } from "@fwge/input"
import { MeshCollider, PhysicsSystem, RigidBody, SphereCollider } from "@fwge/physics"
import { Camera, Colour4, Material, MeshRenderSystem, OBJParser, ParticleSystem, PointLight, ShaderAsset, StaticMesh } from "@fwge/render"
import cubeMTL from '../../../assets/objects/Cube/Cube.mtl?raw'
import cubeOBJ from '../../../assets/objects/Cube/Cube.obj?raw'
import basicFrag from '../../../assets/shaders/Basic.frag?raw'
import defaultFrag from '../../../assets/shaders/Default.frag?raw'
import defaultVert from '../../../assets/shaders/Default.vert?raw'
import simpleFrag from '../../../assets/shaders/Simple.frag?raw'
import commonFrag from '../../../assets/shaders/_common.frag?raw'
import commonVert from '../../../assets/shaders/_common.vert?raw'
import lightingFrag from '../../../assets/shaders/_lighting.frag?raw'
import lightingVert from '../../../assets/shaders/_lighting.vert?raw'
import { FrameCounter } from "../../shared/FrameCounter"

export function physicsInput(game: Game, fpsCounter: HTMLElement)
{
    const canvas = document.querySelector('canvas')!
    const cubeMeshVerts = [
        new Vector3(-0.5,  0.5,  0.5 ),
        new Vector3(-0.5, -0.5,  0.5 ),
        new Vector3( 0.5, -0.5,  0.5 ),
        new Vector3( 0.5,  0.5,  0.5 ),

        new Vector3(-0.5,  0.5,  -0.5 ),
        new Vector3(-0.5, -0.5,  -0.5 ),
        new Vector3( 0.5, -0.5,  -0.5 ),
        new Vector3( 0.5,  0.5,  -0.5 ),
    ]
    const triangularPrismMeshVerts = [
        new Vector3(-0.5, -0.5,  0.5 ),
        new Vector3( 0.5, -0.5,  0.5 ),
        new Vector3( 0.5,  0.5,  0.5 ),

        new Vector3(-0.5, -0.5,  -0.5 ),
        new Vector3( 0.5, -0.5,  -0.5 ),
        new Vector3( 0.5,  0.5,  -0.5 ),
    ]
    const spinnerScript = new Script(
    {
        start()
        {
            this.GetComponent(Transform)!.Rotation.Set(0, Math.random() * 360, Math.random() * 360)
        },
        update(delta: number)
        {
            this.GetComponent(Transform)!.Rotation.Y += delta * 70
            this.GetComponent(Transform)!.Rotation.Z += delta * 120
        }
    })

    new StaticMesh(
    {
        position:
        [
            [-0.5,  0.5,  0.5 ],
            [-0.5, -0.5,  0.5 ],
            [ 0.5, -0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5, -0.5,  0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [-0.5, -0.5, -0.5 ],
            [-0.5,  0.5, -0.5 ],
            [-0.5,  0.5, -0.5 ],
            [-0.5, -0.5, -0.5 ],
            [-0.5, -0.5,  0.5 ],
            [-0.5,  0.5,  0.5 ],
            [-0.5,  0.5, -0.5 ],
            [-0.5,  0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [-0.5, -0.5,  0.5 ],
            [-0.5, -0.5, -0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [ 0.5, -0.5,  0.5 ],
        ],
        normal:
        [
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 1.0,  0.0,  0.0],
            [ 1.0,  0.0,  0.0],
            [ 1.0,  0.0,  0.0],
            [ 1.0,  0.0,  0.0],
            [ 0.0,  0.0,  1.0],
            [ 0.0,  0.0,  1.0],
            [ 0.0,  0.0,  1.0],
            [ 0.0,  0.0,  1.0],
            [-1.0,  0.0,  0.0],
            [-1.0,  0.0,  0.0],
            [-1.0,  0.0,  0.0],
            [-1.0,  0.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0, -1.0,  0.0],
            [ 0.0, -1.0,  0.0],
            [ 0.0, -1.0,  0.0],
            [ 0.0, -1.0,  0.0],
        ],
        colour:
        [
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
        ],
        uv:
        [                
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
        ],
        index:
        [
             0,  1,  2,  0,  2,  3,
             4,  5,  6,  4,  6,  7,
             8,  9, 10,  8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ],
        wireframe:
        [
             0,  1,  1,  2,  2,  3,  3,  0,
             4,  5,  5,  6,  6,  7,  7,  4,
             8,  9,  9, 10, 10, 11, 11,  8,
            12, 13, 13, 14, 14, 15, 15, 12,
            16, 17, 17, 18, 18, 19, 19, 16,
            20, 21, 21, 22, 22, 23, 23, 20,
        ]
    })
    new ShaderAsset(
    {
        vertexShader:
        {
            source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
            input: []
        },
        fragmentShader:
        {
            source: simpleFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
            input: []
        },
    })
    const basicShader = new ShaderAsset(
    {
        vertexShader:
        {
            source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
            input: []
        },
        fragmentShader:
        {
            source: basicFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
            input: []
        },
    })
    new ShaderAsset(
    {
        vertexShader:
        {
            source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
            input: []
        },
        fragmentShader:
        {
            source: defaultFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
            input: []
        },
    })

    const cubeUVMaterial = new Material(
    {
        ambient: new Colour4(0.25, 0.25, 0.25, 1),
        diffuse: new Colour4(0.75, 0.75, 0.75, 1),
        specular: new Colour4(1, 1, 1, 1),
        alpha: 1,
        shininess: 32,
        imagemap: 'assets/objects/cube_2/CubeUV.png',
    })
    const tebogoMaterial = new Material(
    {
        ambient: new Colour4(0.25, 0.25, 0.25, 1),
        diffuse: new Colour4(0.75, 0.75, 0.75, 1),
        specular: new Colour4(1, 1, 1, 1),
        alpha: 1,
        shininess: 32,
        // imagemap: 'assets/img/Tebogo.png'
    })

    cubeUVMaterial.Shader = basicShader
    tebogoMaterial.Shader = basicShader

    new AudioPlayer({ source: '/assets/audio/Minecraft Death Sound Effect.mp3' })

    const hmm = new OBJParser()
    const prefabs = hmm.hmm(cubeOBJ, cubeMTL)

    const scene = game.CreateScene()
    scene.UseSystem(InputSystem)
        .UseSystem(PhysicsSystem)
        .UseSystem(ScriptSystem)
        .UseSystem(ParticleSystem)
        .UseSystem(MeshRenderSystem)
        .UseSystem(FrameCounter, fpsCounter)
    

    const camera = scene.CreateEntity()
        .AddComponent(new Transform({ position: [ 0, 0, 20 ] }))
        .AddComponent(new Camera())
        .AddComponent(new Script(
        {
            start()
            {
                Camera.Main = camera.GetComponent(Camera)!
            },
            update()
            {
                Camera.Main!.AspectRatio = canvas.clientWidth / canvas.clientHeight
            }
        }))
    

    scene.CreateEntity()
        .AddComponent(new Transform())
        .AddComponent(new PointLight(
        {
            colour: new Colour4(1,1,1,1),
            intensity: 1,
            radius: 100
        }))

    // Player
    scene.CreateEntity()
        .AddComponent(new Transform(
        {
            position: [0,0,0],
            scale: [1,3,1]
        }))
        .AddComponent(new MeshCollider(
        {
            vertices:  cubeMeshVerts,
            isTrigger: true,
            onCollision(other)
            {
                console.log(other.Id)
            }
        }))
        .AddComponent(prefabs[0].mesh)
        .AddComponent(cubeUVMaterial)
        // .AddComponent(spinnerScript)
        .AddComponent(new Script(
        {
            update(delta)
            {
                this.GetComponent(Transform)!.Rotation.Z += delta * 50
            }
        }))
        .AddComponent(new Input(
        {
            onInput({ Keyboard, Mouse } , delta)
            {
                if (Keyboard.KeyF5 == KeyState.DOWN)
                {
                    window.location.reload()
                }
                
                const movement = new Vector3()
                if (Keyboard.KeyA === KeyState.DOWN)
                {
                    movement.X -= 1
                }
                if (Keyboard.KeyD === KeyState.DOWN)
                {
                    movement.X += 1
                }
                if (Keyboard.KeyW === KeyState.DOWN)
                {
                    movement.Y += 1
                }
                if (Keyboard.KeyS === KeyState.DOWN)
                {
                    movement.Y -= 1
                }
                movement.Scale(delta * (Keyboard.KeyShift === KeyState.DOWN ? 5 : 2.5))
                this.GetComponent(Transform)!.Position.Sum(movement)
            }
        }))

    const max = 4
    for (let i = 0; i < 2**2; ++i)
    {
        const angle = (i % max) / max
        const radius = Math.floor(i / max - angle)
        const x = Math.sin(angle * 2 * Math.PI)
        const y = Math.cos(angle * 2 * Math.PI)
        const z = 0

        scene.CreateEntity()
            .AddComponent(prefabs[0].mesh)
            .AddComponent(cubeUVMaterial)
            // .AddComponent(spinnerScript)
            .AddComponent(new RigidBody(
            {
                mass: 1,
                velocity: Vector3.ZERO
            }))
            .AddComponent(new MeshCollider(
            {
                vertices:  cubeMeshVerts,
                isTrigger: true,
                onCollision(other)
                {
                    console.log(other.Id)
                }
            }))
            .AddComponent(new Transform(
            {
                position: [ x * (radius + 1.5), y * (radius + 1.5), z]
                // position: [0,1,0]
            }))
    }

    return scene
}
