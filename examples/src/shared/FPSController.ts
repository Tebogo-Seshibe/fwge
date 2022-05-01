import { clamp, Matrix4, Rotation, Vector3, Vector4 } from "@fwge/common"
import { Entity, Scene, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Camera } from "@fwge/render"

type OnInput = (args: IInputArgs, delta: number) => void

interface FPSControllerConfig
{
    camera?: Camera
    eyeLevel?: Vector3
    onInput?: OnInput
    movementSpeed?: number
    turnSpeed?: number
}

export class FPSController extends Entity
{
    public readonly camera: Camera
    public readonly transform: Transform
    public readonly cameraTransform: Transform
    public readonly onInput: OnInput
    public readonly movementSpeed: number
    public readonly turnSpeed: number

    public readonly forward: Vector3 = new Vector3(0,0,-1)
    public readonly right: Vector3 = new Vector3(1,0,0)

    constructor(scene: Scene, args: FPSControllerConfig = {})
    {
        super(scene)

        
        this.transform = new Transform({ position: [ 0, 0, 0 ] })
        this.cameraTransform = new Transform({ position: args.eyeLevel ?? [ 0, 0, 0 ] })
        this.camera = args.camera ?? new Camera()
        this.onInput = args.onInput ?? function(_1: IInputArgs, _2: number) {}
        this.movementSpeed = args.movementSpeed !== undefined ? args.movementSpeed : 100
        this.turnSpeed = args.turnSpeed !== undefined ? args.turnSpeed : 100

        this.AddComponent(this.transform)
        this.AddComponent(new Input(
        {
            onInput: (input, delta) =>
            {                
                const movementSpeed = this.movementSpeed * (input.Keyboard.KeyShift === KeyState.DOWN ? 2 : 1)
                const turnSpeed = this.turnSpeed * (input.Keyboard.KeyShift === KeyState.DOWN ? 2 : 1)

                const rotation = Vector3.Sum(
                    this.transform.Rotation[0],
                    this.transform.Rotation[1],
                    this.transform.Rotation[2],
                    
                    0,
                    input.Mouse.Offset[0] * turnSpeed * delta,
                    0
                )

                rotation[0] = clamp(rotation[0], -80, 80)

                const modelview = Rotation(new Vector3(0, -rotation[1], 0))
                const forward = Matrix4.MultVector(modelview, new Vector4(0, 0, -1, 1)).XYZ.Normalize()
                if (
                    (input.Keyboard.KeyW === KeyState.DOWN && input.Keyboard.KeyS === KeyState.DOWN) ||
                    (input.Keyboard.KeyW !== KeyState.DOWN && input.Keyboard.KeyS !== KeyState.DOWN)
                )
                {
                    forward.Set(0.0)
                }
                else if (input.Keyboard.KeyS === KeyState.DOWN)
                {
                    forward.Scale(-1)
                }
                const right = Matrix4.MultVector(modelview, new Vector4(1, 0, 0, 0)).XYZ.Normalize()
                if (
                    (input.Keyboard.KeyD === KeyState.DOWN && input.Keyboard.KeyA === KeyState.DOWN) ||
                    (input.Keyboard.KeyD !== KeyState.DOWN && input.Keyboard.KeyA !== KeyState.DOWN)
                )
                {
                    right.Set(0.0)
                }
                else if (input.Keyboard.KeyA === KeyState.DOWN)
                {
                    right.Scale(-1)
                }
                const movement = Vector3.Sum(forward, right)
                    .Normalize()
                    .Scale(movementSpeed * delta)

                this.transform.Position.Sum(movement)
                this.transform.Rotation.Set(rotation)
                this.cameraTransform.Rotation[0] += input.Mouse.Offset[1] * turnSpeed * delta
                
                this.onInput(input, delta)
            }
        }))

        this.AddChild(
            scene.CreateEntity()
            .AddComponent(this.cameraTransform)
            .AddComponent(this.camera)
        )
    }
}