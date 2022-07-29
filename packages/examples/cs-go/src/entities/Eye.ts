import { Matrix3, Vector3 } from "@fwge/common"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, SphereCollider } from "@fwge/physics"
import { Camera, Material, PerspectiveCamera } from "@fwge/render"
import { Cube } from "./Cube"
import { GameObject } from "./GameObject"

export class Eye extends GameObject
{
    camera!: Camera 
    collider!: Collider

    private rotationMatrix: Matrix3 = Matrix3.Identity
    private forward: Vector3 = Vector3.Zero
    private right: Vector3 = Vector3.Zero
    private movement: Vector3 = Vector3.Zero

    private readonly movementSpeed: number = 5
    private readonly turnSpeed: number = 5

    override OnCreate()
    {
        super.OnCreate()

        this.camera = new PerspectiveCamera({ fieldOfView: 50 })
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
        const turnDelta = Mouse.Offset.X * this.turnSpeed * delta
        
        Matrix3.RotationMatrix(0, turnDelta, 0, this.rotationMatrix)
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
            this.movement.Scale(movementSpeed * delta / this.movement.Length)

        this.transform.Position.Add(this.movement)
        this.transform.Rotation.Add(0, turnDelta, 0)
    }
}