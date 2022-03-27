import { randBetween } from "@fwge/common"
import { Game, Transform } from "@fwge/core"
import { Input, InputSystem, KeyState } from "@fwge/input"
import { Collider, CubeCollider, PhysicsSystem, RigidBody, SphereCollider } from "@fwge/physics"
import { Camera, Colour4, Material, Mesh, RenderSystem, Shader } from "@fwge/render"
import { FrameCounter } from "../../shared/FrameCounter"

export function physicsInput(game: Game, fpsCounter: HTMLElement)
{
    const meshLibrary = game.GetLibrary(Mesh)
    const shaderLibrary = game.GetLibrary(Shader)
    const materialLibrary = game.GetLibrary(Material)

    const scene = game.CreateScene()
    scene.UseSystem(InputSystem)
        .UseSystem(PhysicsSystem)
        .UseSystem(RenderSystem)
        .UseSystem(FrameCounter, fpsCounter)
    
    const camera = scene.CreateEntity()
        .AddComponent(new Transform())
        .AddComponent(new Camera())
        Camera.Main = camera.GetComponent(Camera)!

    const player = scene.CreateEntity()
        .AddComponent(new Transform(
        {
            position: [ 0, 0, -50 ]
        }))
        .AddComponent(new SphereCollider(
        {
            onCollisionEnter(other)
            {
                other.GetComponent(Material)!.Ambient = new Colour4(1.0,0.0,0.0,1.0)
                // other.RemoveComponent(Collider)
            }
        }))
        .AddComponent(new RigidBody())
        .AddComponent(meshLibrary.Get('Indexed Cube'))
        .AddComponent(shaderLibrary.Get('Simple'))
        .AddComponent(materialLibrary.Get('Default'))
        .AddComponent(new Input(
        {
            onInput({ Mouse }, delta)
            {
                const transform = this.GetComponent(Transform)!
                transform.Position.Set(
                    Mouse.ScreenPosition.X / 25,
                    Mouse.ScreenPosition.Y / 25,
                    -50
                )

                // const speed = delta / (
                //     Keyboard.KeyShift === KeyState.DOWN
                //     ? 50
                //     : 200
                // )

                // if (Keyboard.KeyD === KeyState.DOWN)
                // {
                //     transform.Position.X += speed
                // }

                // if (Keyboard.KeyA === KeyState.DOWN)
                // {
                //     transform.Position.X -= speed
                // }

                // if (Keyboard.KeyW === KeyState.DOWN)
                // {
                //     transform.Position.Y += speed
                // }

                // if (Keyboard.KeyS === KeyState.DOWN)
                // {
                //     transform.Position.Y -= speed
                // }

                console.log(Mouse.ScreenPosition)
            }
        }))

    // scene.CreateEntity()
    //     .AddComponent(meshLibrary.Get('Indexed Cube'))
    //     .AddComponent(shaderLibrary.Get('Simple'))
    //     .AddComponent(new SphereCollider())
    //     .AddComponent(new RigidBody())
    //     .AddComponent(new Transform(
    //     {
    //         position: [ 0, 0, -5 ]
    //     }))
    //     .AddComponent(new Material(
    //     {
    //         ambient: new Colour4(1.0,1.0,1.0,1.0)
    //     }))

    for (let i = 0; i < 200; ++i)
    {
        scene.CreateEntity()
            .AddComponent(meshLibrary.Get('Indexed Cube'))
            .AddComponent(shaderLibrary.Get('Simple'))
            .AddComponent(new SphereCollider(
            {
                isTrigger: false
            }))
            .AddComponent(new RigidBody())
            .AddComponent(new Transform(
            {
                position: [
                    randBetween(-35, 35),
                    randBetween(-25, 25),
                    -50
                ]
            }))
            .AddComponent(new Material(
            {
                ambient: new Colour4(1.0,1.0,1.0,1.0)
            }))
    }

    return scene
}
