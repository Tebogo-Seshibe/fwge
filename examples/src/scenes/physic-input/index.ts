import { Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { Input, InputSystem, KeyState } from "@fwge/input"
import { MeshCollider, PhysicsSystem, RigidBody } from "@fwge/physics"
import { Camera, Colour4, Material, MeshRenderSystem, ParticleSystem, PointLight } from "@fwge/render"
import { ColliderOutlineSystem } from "../../shared/ColliderOutlineSystem"
import { FrameCounter } from "../../shared/FrameCounter"
import { cubeUVMaterial, init, prefabs, simpleCubeMeshOutline, simpleCubeMeshVerts } from "./components"

export function physicsInput(game: Game, fpsCounter: HTMLElement)
{
    init()
    
    const canvas = document.querySelector('canvas')!
    const scene = game.CreateScene()
    const camera = scene.CreateEntity()
    const pointLight = scene.CreateEntity()
    const player = scene.CreateEntity()
    
    scene.UseSystem(InputSystem)
        .UseSystem(PhysicsSystem)
        .UseSystem(ScriptSystem)
        .UseSystem(ParticleSystem)
        .UseSystem(MeshRenderSystem,
        {
            renderGrid: false,
            min: -20,
            max: 20,
            step: 1
        })
        // .UseSystem(ColliderOutlineSystem)
        .UseSystem(FrameCounter, fpsCounter)
    

    let p = 0
    camera.AddComponent(new Transform(
        {
            position: [ 0, 0.5, 15 ] ,
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

    player.AddComponent(new Transform(
        {
            position: [0,0,0],
            scale: [1,1,1],
            rotation: [0, 0, 0]
        }))
        .AddComponent(prefabs[0].mesh)
        .AddComponent(new MeshCollider(
        {
            vertices:  simpleCubeMeshVerts,
            outline: simpleCubeMeshOutline,
            isTrigger: true,
            onCollision(other)
            {
                other.GetComponent(Material)!.Ambient.Set(1,0,0,1)
                other.GetComponent(Material)!.Diffuse.Set(1,0,0,1)
                other.GetComponent(Material)!.Specular.Set(1,0,0,1)
            }
        }))
        .AddComponent(cubeUVMaterial)
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
    for (let i = 0; i < 2**4; ++i)
    {
        const angle = (i % max) / max
        const radius = Math.floor(i / max - angle)
        const x = Math.sin(angle * 2 * Math.PI)
        const y = Math.cos(angle * 2 * Math.PI)
        const z = 0

        const transform = new Transform(
        {
            position: [x * (radius + 3.5), y * (radius + 3.5), z]
        })
        const child = scene.CreateEntity()

        child.AddComponent(transform)
            .AddComponent(cubeUVMaterial)
            .AddComponent(prefabs[0].mesh)
            .AddComponent(new RigidBody(
            {
                mass: 1,
                velocity: Vector3.ZERO
            }))
            .AddComponent(new MeshCollider(
            {
                vertices:  simpleCubeMeshVerts,
                outline: simpleCubeMeshOutline,
                isTrigger: true,
                onCollision(other)
                {
                    other.GetComponent(Material)!.Ambient.Set(1,0,0,1)
                    other.GetComponent(Material)!.Diffuse.Set(1,0,0,1)
                    other.GetComponent(Material)!.Specular.Set(1,0,0,1)
                }
            }))
    }

    return scene
}
