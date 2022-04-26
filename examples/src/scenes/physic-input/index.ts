import { GL, Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { Input, InputSystem, KeyState } from "@fwge/input"
import { MeshCollider, PhysicsSystem, RigidBody } from "@fwge/physics"
import { Camera, Colour4, Material, MeshRenderSystem, ParticleSpawner, ParticleSystem, PointLight } from "@fwge/render"
import { ColliderOutlineSystem } from "../../shared/ColliderOutlineSystem"
import { FrameCounter } from "../../shared/FrameCounter"
import { base, basicShader, cubeMesh, cubeUVMaterial, init, prefabs, simpleCubeMeshOutline, simpleCubeMeshVerts, spinnerScript } from "./components"

export function physicsInput(game: Game, fpsCounter: HTMLElement)
{
    init()

    GL.enable(GL.DEPTH_TEST)
    GL.disable(GL.BLEND)
    GL.enable(GL.CULL_FACE)

    GL.canvas.width = 1920
    GL.canvas.height = 1080
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    GL.clearColor(0.0, 0.0, 0.0, 1.0)

    const canvas = document.querySelector('canvas')!
    const scene = game.CreateScene()
    const camera = scene.CreateEntity()
    const pointLight = scene.CreateEntity()
    const player = scene.CreateEntity()

    scene.UseSystem(InputSystem)
        .UseSystem(ScriptSystem)
        .UseSystem(PhysicsSystem)
        .UseSystem(MeshRenderSystem,
        {
            renderGrid: false,
            min: -20,
            max: 20,
            step: 1,
            wireframe: true
        })
        .UseSystem(ParticleSystem)
        // .UseSystem(ColliderOutlineSystem)
        .UseSystem(FrameCounter, fpsCounter)


    camera.AddComponent(new Transform(
        {
            position: [ 0, 0.5, 5 ],
            rotation: [ 0, 0, 0 ]
        }))
        .AddComponent(new Camera({ fieldOfView: 50 }))
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


    pointLight.AddComponent(new Transform())
        .AddComponent(new PointLight(
        {
            colour: new Colour4(1,1,1,1),
            intensity: 1,
            radius: 100
        }))

    const particles = new ParticleSpawner(
    {
        size: 1,
        mesh: prefabs[0].mesh
    })

    player.AddComponent(new Transform())
        // .AddComponent(base[0].mesh)
        // .AddComponent(particles.ParticleMesh)
        .AddComponent(prefabs[0].material)
        .AddComponent(new RigidBody({ velocity: new Vector3(0,-0.2,0) }))
        .AddComponent(spinnerScript)
        .AddComponent(particles)
        .AddComponent(new MeshCollider(
        {
            vertices:   simpleCubeMeshVerts,
            outline:    simpleCubeMeshOutline,
            isTrigger:  false,
        }))
        .AddComponent(new Input(
        {
            onInput({ Keyboard } , delta)
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
                if (Keyboard.KeyQ === KeyState.DOWN)
                {
                    movement.Z += 1
                }
                if (Keyboard.KeyE === KeyState.DOWN)
                {
                    movement.Z -= 1
                }
                movement.Scale(delta * (Keyboard.KeyShift === KeyState.DOWN ? 5 : 2.5))
                this.GetComponent(Transform)!.Position.Sum(movement)
            }
        }))

    const max = 4
    for (let i = 0; i < 1; ++i)
    {
        const angle = (i % max) / max
        const radius = Math.floor(i / max - angle)
        const x = Math.sin(angle * 2 * Math.PI)
        const y = Math.cos(angle * 2 * Math.PI)
        const z = 0

        const transform = new Transform(
        {
            position: [0,-2,0
                // x * (radius + 1.5),
                // y * (radius + 1.5),
                // z
            ],
        })
        transform.Scale.Scale(2)
        const child = scene.CreateEntity()

        child.AddComponent(transform)
            .AddComponent(new RigidBody({ velocity: new Vector3(0,0.2,0)}))
            .AddComponent(prefabs[0].material)
            // .AddComponent(prefabs[0].mesh)
            .AddComponent(new MeshCollider(
            {
                vertices:   simpleCubeMeshVerts,
                outline:    simpleCubeMeshOutline,
                isTrigger:  false
            }))
    }

    return scene
}
