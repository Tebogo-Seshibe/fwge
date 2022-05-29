import { clamp, Matrix4, Rotation, Vector3, Vector4 } from "@fwge/common"
import { Entity, FWGEComponent, Scene, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { MeshCollider } from "@fwge/physics"
import { Camera } from "@fwge/render"
import { cubeCollier } from "../components/Colliders"

type OnInput = (args: IInputArgs, delta: number) => void

interface FPSControllerConfig
{
    eyeLevel?: Vector3 | [number, number, number]

    movementSpeed?: number
    turnSpeed?: number

    camera?: Camera
    onInput?: OnInput
}

export class FPSController extends Entity
{
    public static readonly FORWARD: Vector4 = new Vector4(0, 0, -1, 0)
    public static readonly RIGHT: Vector4 = new Vector4(1, 0, 0, 0)
    public static readonly UP: Vector4 = new Vector4(0, 1, 0, 0)

    public readonly camera: Camera
    public readonly cameraTransform: Transform

    public readonly onInput: OnInput

    public readonly movementSpeed: number
    public readonly walkSpeed: number
    public readonly runSpeed: number
    public readonly turnSpeed: number    
    
    
    @FWGEComponent(new Transform())
    transform!: Transform

    @FWGEComponent(MeshCollider)
    collider!: MeshCollider

    constructor(private scene: Scene, args: FPSControllerConfig = { })
    {
        super(scene)

        this.camera = args.camera ?? new Camera()
        this.cameraTransform = new Transform({ position: args.eyeLevel ?? [0, 1.8, 0] })
        this.onInput = args.onInput ?? function (_1: IInputArgs, _2: number) {}

        this.movementSpeed = args.movementSpeed ?? 5
        this.walkSpeed = args.movementSpeed ?? 10
        this.runSpeed = args.movementSpeed ?? 15
        this.turnSpeed = args.turnSpeed ?? 50

    }

    OnCreate(): void
    {
        super.OnCreate()
        
        Camera.Main = this.camera
        this.collider = cubeCollier()
        this.AddComponent(new Input(
        {
            onInput: (input, delta) =>
            {                
                const movementSpeed = this.movementSpeed * (input.Keyboard.KeyShift === KeyState.DOWN ? 2 : 1)
                const turnSpeed = this.turnSpeed

                const rotation = Vector3.Sum(
                    this.transform.Rotation[0], this.transform.Rotation[1], this.transform.Rotation[2],
                    0, input.Mouse.Offset.X * turnSpeed * delta, 0
                )

                const modelview = Rotation(new Vector3(0, -rotation.Y, 0))
                const forward = Matrix4.MultVector(modelview, FPSController.FORWARD).XYZ.Normalize()
                const right = Matrix4.MultVector(modelview, FPSController.RIGHT).XYZ.Normalize()

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

                const movement = Vector3.Sum(forward, right).Normalize().Scale(movementSpeed * delta)

                this.transform.Position.Sum(movement)
                this.transform.Rotation.Set(rotation)
                this.cameraTransform.Rotation.X = clamp(this.cameraTransform.Rotation.X + (input.Mouse.Offset.Y * turnSpeed * delta), -80, 80)
                
                this.onInput(input, delta)
            }
        }))

        this.AddChild(
            this.scene.CreateEntity()
            .AddComponent(this.cameraTransform)
            .AddComponent(this.camera)
        )
    }
}