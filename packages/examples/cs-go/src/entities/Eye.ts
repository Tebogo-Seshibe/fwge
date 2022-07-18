import { Matrix3, Vector2, Vector3 } from "@fwge/common"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, SphereCollider } from "@fwge/physics"
import { Camera, Material, PerspectiveCamera } from "@fwge/render"
import { Cube } from "./Cube"
import { GameObject } from "./GameObject"

export class Eye extends GameObject
{
    camera!: Camera 
    collider!: Collider

    private rotation: Vector3 = Vector3.Zero
    private rotationMatrix: Matrix3 = Matrix3.Identity
    private forward: Vector3 = Vector3.Zero
    private right: Vector3 = Vector3.Zero
    private up: Vector3 = Vector3.UnitY
    private movement: Vector3 = Vector3.Zero

    private readonly movementSpeed: number = 5
    private readonly turnSpeed: number = 25

    override OnCreate()
    {
        super.OnCreate()

        this.camera = new PerspectiveCamera()
        this.collider = new SphereCollider(
        {
            isTrigger: true,
            onCollisionEnter: other =>
            {
                const otherMaterial = other instanceof Cube 
                    ? other.material
                    : other.GetComponent(Material)
    
                if (otherMaterial)
                {
                    otherMaterial.Ambient.Set(1,0,0,1)
                }
            },
            onCollisionExit: other =>
            {
                const otherMaterial = other instanceof Cube 
                    ? other.material
                    : other.GetComponent(Material)
    
                if (otherMaterial)
                {
                    otherMaterial.Ambient.Set(1,1,1,1)
                }
            }
        })

        this.AddComponent(this.camera)
        // this.AddComponent(this.collider)
    }

    OnStart()
    {
        Camera.Main = this.camera
        this.transform.Position.Z = 5
        this.transform.Position.Y = 1
    }

    override OnInput({ Keyboard, Mouse }: IInputArgs, delta: number): void
    {
        const wPressed = Keyboard.KeyW !== KeyState.RELEASED && Keyboard.KeyW !== KeyState.UP
        const aPressed = Keyboard.KeyA !== KeyState.RELEASED && Keyboard.KeyA !== KeyState.UP
        const sPressed = Keyboard.KeyS !== KeyState.RELEASED && Keyboard.KeyS !== KeyState.UP
        const dPressed = Keyboard.KeyD !== KeyState.RELEASED && Keyboard.KeyD !== KeyState.UP
        const shiftPressed = Keyboard.KeyShift !== KeyState.RELEASED && Keyboard.KeyShift !== KeyState.UP

        const movementSpeed = this.movementSpeed * (shiftPressed ? 2 : 1)
        const currentRotation = this.transform.Rotation

        const deltaRotation = Vector2.Scale(Mouse.Offset, this.turnSpeed * delta)
        Vector3.Add(
            currentRotation[0], currentRotation[1], currentRotation[2],
            0, deltaRotation.X, 0,
            this.rotation
        )
        
        Matrix3.RotationMatrix(0, this.rotation.Y, 0, this.rotationMatrix)
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
        this.movement.Scale(this.movement.Length / movementSpeed * delta)

        this.transform.Position.Add(this.movement)
        this.transform.Rotation.Set(this.rotation)
    }
}