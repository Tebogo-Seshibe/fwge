import { Matrix3, Vector2, Vector3 } from "@fwge/common"
import { FWGEComponent } from "@fwge/core"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, SphereCollider } from "@fwge/physics"
import { Camera, Material, PerspectiveCamera } from "@fwge/render"
import { Cube } from "./Cube"
import { GameObject } from "./GameObject"

export class Eye extends GameObject
{
    @FWGEComponent(new PerspectiveCamera())
    camera!: Camera

    @FWGEComponent(new SphereCollider(
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
    }))
    collider!: Collider

    private readonly movementSpeed: number = 5
    private readonly turnSpeed: number = 25

    override OnCreate()
    {
        super.OnCreate()
    
        Camera.Main = this.camera
        this.transform.Position.Z = 5
    }

    override Input({ Keyboard, Mouse }: IInputArgs, delta: number): void
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
            forward.Set(0)
        }
        else if (!wPressed && sPressed)
        {
            forward.Negate()
        }
        if ((dPressed && aPressed) || (!dPressed && !aPressed))
        {
            right.Set(0)
        }
        else if (!dPressed && aPressed)
        {
            right.Negate()
        }

        const movement = Vector3.Add(forward, right).Normalize().Scale(movementSpeed * delta)

        this.transform.Position.Add(movement)
        this.transform.Rotation.Set(rotation)
    }
}