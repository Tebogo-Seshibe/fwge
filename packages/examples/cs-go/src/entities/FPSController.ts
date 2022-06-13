import { clamp, Matrix3, Vector2, Vector3 } from "@fwge/common"
import { Entity, FWGEComponent, Scene, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Collider, CubeCollider, RigidBody, SphereCollider } from "@fwge/physics"
import { Camera, PerspectiveCamera } from "@fwge/render"
import { GameObject } from "./GameObject"

type OnInput = (args: IInputArgs, delta: number) => void

interface FPSControllerConfig
{
    eyeLevel?: Vector3 | [number, number, number]

    movementSpeed?: number
    turnSpeed?: number
    jumpHeight?: number

    camera?: Camera
    onInput?: OnInput
}

export class FPSController extends Entity
{
    public static readonly FORWARD: Vector3 = new Vector3(0, 0, -1)
    public static readonly RIGHT: Vector3 = new Vector3(1, 0, 0)
    public static readonly UP: Vector3 = new Vector3(0, 1, 0)

    public readonly camera: Camera
    public readonly cameraTransform: Transform

    public readonly onInput: OnInput

    public readonly movementSpeed: number
    public readonly walkSpeed: number
    public readonly runSpeed: number
    public readonly turnSpeed: number
    public readonly jumpHeight: number  
    canJump: boolean = true
    
    @FWGEComponent(new RigidBody({ mass: 5 }))
    rigidbody!: RigidBody

    @FWGEComponent(new SphereCollider(
    {
        isTrigger: true,
        position: new Vector3(0, 0.25, 0),
    }))
    collider!: Collider
    
    @FWGEComponent(new Transform({ position: [ 0, 0, 5 ]}))
    transform!: Transform

    constructor(private scene: Scene, args: FPSControllerConfig = { })
    {
        super(scene)

        this.camera = args.camera ?? new PerspectiveCamera()
        this.cameraTransform = new Transform({ position: args.eyeLevel ?? [0, 1.8, 0] })
        
        this.onInput = ({ Keyboard }) =>
        {
            if (this.canJump && Keyboard.KeySpace === KeyState.PRESSED)
            {
                this.canJump = false
                this.rigidbody.Velocity.Add(0, this.jumpHeight, 0)
            }
            else if (!this.canJump && Keyboard.KeySpace === KeyState.UP)
            {
                this.canJump = true
            }
        }

        this.movementSpeed = args.movementSpeed ?? 5
        this.walkSpeed = args.movementSpeed ?? 10
        this.runSpeed = args.movementSpeed ?? 15
        this.turnSpeed = args.turnSpeed ?? 36
        this.jumpHeight = args.jumpHeight ?? 15

    }

    OnCreate(): void
    {
        super.OnCreate()
        
        Camera.Main = this.camera
        this.AddComponent(new Input(
        {
            onInput: (input, delta) =>
            {
                const wPressed = input.Keyboard.KeyW !== KeyState.RELEASED && input.Keyboard.KeyW !== KeyState.UP
                const aPressed = input.Keyboard.KeyA !== KeyState.RELEASED && input.Keyboard.KeyA !== KeyState.UP
                const sPressed = input.Keyboard.KeyS !== KeyState.RELEASED && input.Keyboard.KeyS !== KeyState.UP
                const dPressed = input.Keyboard.KeyD !== KeyState.RELEASED && input.Keyboard.KeyD !== KeyState.UP
                const shiftPressed = input.Keyboard.KeyShift !== KeyState.RELEASED && input.Keyboard.KeyShift !== KeyState.UP

                const movementSpeed = this.movementSpeed * (shiftPressed ? 2 : 1)

                const deltaRotation = Vector2.Scale(input.Mouse.Offset, this.turnSpeed * delta)
                const rotation = this.transform.Rotation.Clone().Add(0, deltaRotation.X, 0)
                
                const rotationMatrix = Matrix3.RotationMatrix(0, rotation.Y, 0)
                const forward = Matrix3.MultiplyVector(rotationMatrix, 0, 0, -1).Normalize()
                const right = Matrix3.MultiplyVector(rotationMatrix, 1, 0, 0).Normalize()
                
                if ((wPressed && sPressed) || (!wPressed && !sPressed))
                {
                    forward.Set(0.0)
                }
                else if (!wPressed && sPressed)
                {
                    forward.Negate()
                }
                if ((dPressed && aPressed) || (!dPressed && !aPressed))
                {
                    right.Set(0.0)
                }
                else if (!dPressed && aPressed)
                {
                    right.Negate()
                }

                const movement = Vector3.Add(forward, right).Normalize().Scale(movementSpeed * delta)

                this.transform.Position.Add(movement)
                this.transform.Rotation.Set(rotation)
                this.cameraTransform.Rotation.X = clamp(this.cameraTransform.Rotation.X + deltaRotation.Y, -80, 80)
                
                this.onInput(input, delta)
            }
        }))

        this.AddChild(
            this.scene.CreateEntity()
            .AddComponent(this.cameraTransform)
            .AddComponent(this.camera)
        )

        this.AddComponent(new CubeCollider({
            height: 2,
            position: new Vector3(0,1,0)
        }))
    }
}