import { clamp, Matrix3, Vector2, Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, RigidBody, SphereCollider } from "@fwge/physics"
import { Camera, PerspectiveCamera, PointLight } from "@fwge/render"
import { Light } from "@fwge/render/lib/components/lights/Light"
import { GameObject } from "./GameObject"

export class FPSController extends GameObject
{
    static readonly FORWARD: Vector3 = new Vector3(0, 0, -1)
    static readonly RIGHT: Vector3 = new Vector3(1, 0, 0)
    static readonly UP: Vector3 = new Vector3(0, 1, 0)
    
    readonly camera: Camera = new PerspectiveCamera({ fieldOfView: 75 })
    readonly cameraTransform: Transform = new Transform({ position: [0,1.8,0] })
    
    readonly rotationMatrix: Matrix3 = Matrix3.Identity
    readonly forward: Vector3 = Vector3.Zero
    readonly right: Vector3 = Vector3.Zero
    readonly movement: Vector3 = Vector3.Zero
    readonly rotationDelta: Vector2 = Vector2.Zero

    readonly movementSpeed: number = 5
    readonly turnSpeed: number = 50
    readonly jumpHeight: number = 15
    
    canJump: boolean = true

    rigidbody!: RigidBody
    collider!: Collider
    light!: Light

    override OnCreate(): void
    {
        this.transform.Position.Z = 5

        this.rigidbody = new RigidBody({ mass: 5 })
        this.collider = new SphereCollider(
        {
            isTrigger: true,
            position: new Vector3(0, 0.25, 0),
        })
        this.light = new PointLight({
            colour: [1,1,1,1],
            intensity: 0.5,
            radius: 100
        })

        this.AddComponent(this.rigidbody)
        this.AddComponent(this.collider)
        
        this.AddChild(
            this.Scene.CreateEntity()
            .AddComponent(this.cameraTransform)
            .AddComponent(this.camera)
            .AddComponent(this.light)
        )
        console.log(this)
        Camera.Main = this.camera
    }

    override OnInput({ Keyboard, Mouse }: IInputArgs, delta: number): void
    {
        const wPressed = Keyboard.KeyW !== KeyState.RELEASED && Keyboard.KeyW !== KeyState.UP
        const aPressed = Keyboard.KeyA !== KeyState.RELEASED && Keyboard.KeyA !== KeyState.UP
        const sPressed = Keyboard.KeyS !== KeyState.RELEASED && Keyboard.KeyS !== KeyState.UP
        const dPressed = Keyboard.KeyD !== KeyState.RELEASED && Keyboard.KeyD !== KeyState.UP
        const shiftPressed = Keyboard.KeyShift !== KeyState.RELEASED && Keyboard.KeyShift !== KeyState.UP
        const movementSpeed = this.movementSpeed * (shiftPressed ? 2 : 1)
        
        Vector2.Scale(Mouse.Offset, this.turnSpeed * delta, this.rotationDelta)
        this.transform.Rotation.Y += this.rotationDelta.X
        this.cameraTransform.Rotation.X = clamp(this.cameraTransform.Rotation.X + this.rotationDelta.Y, -80, 80)

        Matrix3.RotationMatrix(this.transform.Rotation, this.rotationMatrix)
        Matrix3.MultiplyVector(this.rotationMatrix, 0, 0, -1, this.forward)
        Matrix3.MultiplyVector(this.rotationMatrix, 1, 0, 0, this.right)

        if ((wPressed && sPressed) || (!wPressed && !sPressed))
        {
            this.forward.Set(0)
        }
        else if (!wPressed && sPressed)
        {
            this.forward.Negate()
        }

        if ((dPressed && aPressed) || (!dPressed && !aPressed))
        {
            this.right.Set(0)
        }
        else if (!dPressed && aPressed)
        {
            this.right.Negate()
        }

        Vector3.Add(this.forward, this.right, this.movement)
        if (this.movement.Length !== 0)
        {
            this.movement.Scale(movementSpeed * delta / this.movement.Length)
        }

        this.transform.Position.Add(this.movement)
        
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
