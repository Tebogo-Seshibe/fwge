import { randBetween } from "@fwge/common"
import { Game, Transform } from "@fwge/core"
import { Input, InputSystem, KeyState } from "@fwge/input"
import { CubeCollider, PhysicsSystem, RigidBody } from "@fwge/physics"
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
            scale: [0.5,0.5,0.5],
            position: [0, 0, -5]
        }))
        .AddComponent(new CubeCollider(
        {
            onCollisionEnter(other)
            {
                other.GetComponent(Material)!.Ambient = new Colour4(1.0,0.0,0.0,1.0)
            },
            onCollisionExit(other)
            {
                other.GetComponent(Material)!.Ambient = new Colour4(1.0,1.0,1.0,1.0)
            }
        }))
        .AddComponent(new RigidBody())
        .AddComponent(meshLibrary.Get('Indexed Cube'))
        .AddComponent(shaderLibrary.Get('Simple'))
        .AddComponent(materialLibrary.Get('Default'))
        .AddComponent(new Input(
        {
            onInput({ Mouse, Keyboard }, delta)
            {
                const transform = this.GetComponent(Transform)!
                const speed = delta / 200

                if (Keyboard.KeyD === KeyState.DOWN)
                {
                    transform.Position.X += speed
                }

                if (Keyboard.KeyA === KeyState.DOWN)
                {
                    transform.Position.X -= speed
                }

                if (Keyboard.KeyW === KeyState.DOWN)
                {
                    transform.Position.Y += speed
                }

                if (Keyboard.KeyS === KeyState.DOWN)
                {
                    transform.Position.Y -= speed
                }
            }
        }))
    for (let i = 0; i < 200; ++i)
    {
        scene.CreateEntity()
            .AddComponent(meshLibrary.Get('Indexed Cube'))
            .AddComponent(shaderLibrary.Get('Simple'))
            .AddComponent(new CubeCollider())
            .AddComponent(new RigidBody())
            .AddComponent(new Transform(
            {
                scale: [0.5,0.5,0.5],
                position: [
                    randBetween(-2, 2),
                    randBetween(-2, 2),
                    -5
                ]
            }))
            .AddComponent(new Material(
            {
                ambient: new Colour4(1.0,1.0,1.0,1.0)
            }))
    }

    console.log({ camera, player })
    return scene
}
