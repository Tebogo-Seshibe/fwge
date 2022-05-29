import { clamp, Matrix4, Rotation, Vector3, Vector4 } from "@fwge/common"
import { Entity, Scene, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Camera } from "@fwge/render"

type OnInput = (args: IInputArgs, delta: number) => void

interface FPSControllerConfig
{
    eyeLevel?: Vector3 | [number, number, number]
    forward?: Vector3 | [number, number, number]
    right?: Vector3 | [number, number, number]

    movementSpeed?: number
    turnSpeed?: number

    camera?: Camera
    onInput?: OnInput
}

export class FPSController extends Entity
{
    public readonly camera: Camera
    public readonly cameraTransform: Transform
    public readonly forward: Vector3
    public readonly right: Vector3

    public readonly transform: Transform
    public readonly onInput: OnInput

    public readonly movementSpeed: number
    public readonly turnSpeed: number    

    constructor(scene: Scene, args: FPSControllerConfig = {})
    {
        super(scene)
        args.forward = args.forward ?? [0, 0, -1]
        args.right = args.right ?? [1, 0, 0]
        args.eyeLevel = args.eyeLevel ?? [ 0, 1.8, 0 ]

        this.camera = args.camera ?? new Camera()
        this.cameraTransform = new Transform({ position: args.eyeLevel })
        this.forward = new Vector3(args.forward[0], args.forward[1], args.forward[2])
        this.right = new Vector3(args.right[0], args.right[1], args.right[2])

        this.transform = new Transform()
        this.onInput = args.onInput ?? function (_1: IInputArgs, _2: number) {}

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
                    input.Mouse.Offset.X * turnSpeed * delta,
                    0
                )

                const modelview = Rotation(new Vector3(0, -rotation.Y, 0))
                const forward = Matrix4.MultVector(modelview, new Vector4(0, 0, -1, 1)).XYZ.Normalize()
                const right = Matrix4.MultVector(modelview, new Vector4(1, 0, 0, 0)).XYZ.Normalize()

                if (
                    (input.Keyboard.KeyW === KeyState.DOWN && input.Keyboard.KeyS === KeyState.DOWN) ||
                    (input.Keyboard.KeyW !== KeyState.DOWN && input.Keyboard.KeyS !== KeyState.DOWN)
                )
                {
                    forward.Set(0.0)
                }
                else if (input.Keyboard.KeyS === KeyState.DOWN)
                {
                    forward.Scale(-1.0)
                }
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

                const movement = Vector3.Sum(forward, right).Normalize().Scale(movementSpeed)

                this.transform.Position.Sum(movement.Scale(delta))
                this.transform.Rotation.Set(rotation)
                this.cameraTransform.Rotation.X = clamp(this.cameraTransform.Rotation.X + (input.Mouse.Offset.Y * turnSpeed * delta), -80, 80)
                
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