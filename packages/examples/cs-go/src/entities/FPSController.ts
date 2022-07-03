import { clamp, Matrix3, Vector2, Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, RigidBody, SphereCollider } from "@fwge/physics"
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

export class FPSController extends GameObject
{
    static readonly FORWARD: Vector3 = new Vector3(0, 0, -1)
    static readonly RIGHT: Vector3 = new Vector3(1, 0, 0)
    static readonly UP: Vector3 = new Vector3(0, 1, 0)
    
    readonly camera: Camera = new PerspectiveCamera({ fieldOfView: 75 })
    readonly cameraTransform: Transform = new Transform({ position: [0,1.8,0] })

    movementSpeed: number = 5
    walkSpeed: number = 10
    runSpeed: number = 15
    turnSpeed: number = 36
    jumpHeight: number = 15
    canJump: boolean = true
    
    rigidbody: RigidBody = new RigidBody({ mass: 5 })
    collider: Collider = new SphereCollider(
    {
        isTrigger: true,
        position: new Vector3(0, 0.25, 0),
    })

    override OnCreate(): void
    {
        this.transform.Position.Z = 5
        
        this.AddChild(
            this.Scene.CreateEntity()
            .AddComponent(this.cameraTransform)
            .AddComponent(this.camera)
        )
        
        Camera.Main = this.camera
    }

    override OnStart()
    {
    }

    override OnInput({ Keyboard, Mouse }: IInputArgs, delta: number): void
    {
        const wPressed = Keyboard.KeyW !== KeyState.RELEASED && Keyboard.KeyW !== KeyState.UP
        const aPressed = Keyboard.KeyA !== KeyState.RELEASED && Keyboard.KeyA !== KeyState.UP
        const sPressed = Keyboard.KeyS !== KeyState.RELEASED && Keyboard.KeyS !== KeyState.UP
        const dPressed = Keyboard.KeyD !== KeyState.RELEASED && Keyboard.KeyD !== KeyState.UP
        const shiftPressed = Keyboard.KeyShift !== KeyState.RELEASED && Keyboard.KeyShift !== KeyState.UP

        const movementSpeed = this.movementSpeed * (shiftPressed ? 2 : 1)

        const deltaRotation = Vector2.Scale(Mouse.Offset, this.turnSpeed * delta)
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
    
}