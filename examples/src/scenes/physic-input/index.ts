import { AudioPlayer } from "@fwge/audio"
import { randBetween, Vector2, Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { ButtonState, Input, InputSystem, KeyState } from "@fwge/input"
import { CubeCollider, PhysicsSystem, RigidBody, SphereCollider } from "@fwge/physics"
import { Camera, Colour4, Material, Mesh, PointLight, RenderSystem, Shader } from "@fwge/render"
import { FrameCounter } from "../../shared/FrameCounter"

export function physicsInput(game: Game, fpsCounter: HTMLElement)
{
    const meshLibrary = game.GetLibrary(Mesh)
    const shaderLibrary = game.GetLibrary(Shader)
    const materialLibrary = game.GetLibrary(Material)
    const scriptLibrary = game.GetLibrary(Script)
    const audioLibrary = game.GetLibrary(AudioPlayer)

    const scene = game.CreateScene()
    scene.UseSystem(InputSystem)
        .UseSystem(PhysicsSystem)
        .UseSystem(RenderSystem)
        .UseSystem(ScriptSystem)
        .UseSystem(FrameCounter, fpsCounter)
    
    const camera = scene.CreateEntity()
        .AddComponent(new Transform())
        .AddComponent(new Camera())
        Camera.Main = camera.GetComponent(Camera)!

    const player = scene.CreateEntity()
        .AddComponent(new Transform(
        {
            position: [ 0, 1.5, -5 ],
        }))
        // .AddComponent(new Script(
        // {
        //     update(delta: number)
        //     {
        //         // this.GetComponent(Transform)!.Position.Y -= delta
        //     }    
        // }))
        .AddComponent(new CubeCollider(
        {
            isTrigger: true,
            onCollisionEnter(other)
            {
                this.GetComponent(AudioPlayer)!.Play({ seconds: 5 })
                other.GetComponent(Material)!.Ambient = new Colour4(1.0, 0.0, 0.0, 1.0)
            },
            onCollisionExit(other)
            {
                other.GetComponent(Material)!.Ambient = new Colour4(1.0, 1.0, 1.0, 1.0)
            }
        }))
        .AddComponent(new RigidBody({ }))
        .AddComponent(new PointLight())
        .AddComponent(audioLibrary.Get('Oof'))
        .AddComponent(meshLibrary.Get('OBJ Cube'))
        .AddComponent(shaderLibrary.Get('Simple'))
        .AddComponent(materialLibrary.Get('OBJ Cube'))
        .AddComponent(new Input(
        {
            onInput({ Keyboard, Controllers, Mouse })
            {
                const velocity = Vector3.ZERO                
                const speed = (
                    Keyboard.KeyShift === KeyState.DOWN
                    ? 5
                    : 2.5
                )

                const controller = Controllers.find(x => !!x)
                if (controller)
                {
                    const deadzone = 0.11
                    const leftStick = new Vector2(
                        Math.abs(controller.LeftStick.X) - deadzone > deadzone
                            ? controller.LeftStick.X
                            : 0,
                        Math.abs(controller.LeftStick.Y) - deadzone > deadzone
                            ? controller.LeftStick.Y
                            : 0
                    )
                    const speed = (
                        controller.LeftTrigger === ButtonState.PRESSED  ||
                        controller.RightTrigger === ButtonState.PRESSED
                    ) ? 25 : 10

                    velocity.X += leftStick.X * speed
                    velocity.Y += leftStick.Y * speed                
                }
                else
                {
                    if (Keyboard.KeyD === KeyState.DOWN)
                    {
                        velocity.X += speed
                    }
    
                    if (Keyboard.KeyA === KeyState.DOWN)
                    {
                        velocity.X -= speed
                    }
    
                    if (Keyboard.KeyW === KeyState.DOWN)
                    {
                        velocity.Y += speed
                    }
    
                    if (Keyboard.KeyS === KeyState.DOWN)
                    {
                        velocity.Y -= speed
                    }
                }

                this.GetComponent(RigidBody)?.Velocity.Set(velocity)
            }
        }))

    scene.CreateEntity()
        .AddComponent(meshLibrary.Get('OBJ Cube'))
        .AddComponent(materialLibrary.Get('Default'))
        .AddComponent(shaderLibrary.Get('Simple'))
        .AddComponent(new CubeCollider({ isStatic: false }))
        .AddComponent(new RigidBody())
        .AddComponent(new Transform(
        {
            position: [ 0, 0, -5 ]
        }))
        .AddComponent(new Material(
        {
            ambient: new Colour4(1.0, 1.0, 1.0, 1.0)
        }))

    // for (let i = 0; i < 100; ++i)
    // {
    //     const child = scene.CreateEntity()
    //         .AddComponent(meshLibrary.Get('OBJ Cube'))
    //         .AddComponent(shaderLibrary.Get('Simple'))
    //         .AddComponent(new CubeCollider(
    //         {
    //             isTrigger: false
    //         }))
    //         .AddComponent(new RigidBody(
    //         {
    //             // velocity: new Vector3(
    //             //     randBetween(-2, 2),
    //             //     randBetween(-2, 2),
    //             //     0
    //             // )
    //         }))
    //         .AddComponent(new Transform(
    //         {
    //             scale: new Vector3(1),
    //             position: [
    //                 randBetween(-35, 35),
    //                 randBetween(-25, 25),
    //                 -50
    //             ]
    //         }))
    //         .AddComponent(new Material(
    //         {
    //             ambient: new Colour4(1.0, 1.0, 1.0, 1.0)
    //         }))
    // }

    return scene
}
