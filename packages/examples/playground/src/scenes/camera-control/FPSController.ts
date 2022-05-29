import { clamp, Vector3 } from "@fwge/common"
import { Entity, Scene, Script, Transform } from "@fwge/core"
import { ButtonState, IInputArgs, Input, KeyState } from "@fwge/input"
import { Camera, ViewMode } from "@fwge/render"

export class FPSController extends Entity
{
    private readonly maxMoveSpeed = 1
    private readonly minMoveSpeed = 0.1
    private readonly deltaMoveSpeed = 0.01
    private readonly turnSpeed = 5

    private movementSpeed: number = this.minMoveSpeed
    private transform: Transform
    private camera: Camera

    constructor(scene: Scene)
    {
        super(scene)
        
        this.AddComponent(new Camera(
        {
            mode: ViewMode.PERSPECTIVE,
            aspectRatio: 1920/1080,
            fieldOfView: 45,
            nearClipping: 0.1,
            farClipping: 100
        }))
        this.AddComponent(new Transform(
        {
            position: new Vector3(0, 0, 5)
        }))
        this.AddComponent(new Script(
        {
            start: () => Camera.Main = this.camera
        }))
        this.AddComponent(new Input(
        {
            onInput: ({ Keyboard, Mouse }: IInputArgs, delta: number) =>
            {
                if (Keyboard.KeyF5 !== KeyState.UP)
                {
                    window.location.reload()
                }

                const direction = (Keyboard.KeyShift === KeyState.DOWN) ? 1 : -1
                const movement = new Vector3(0, 0, 0)
                const rotation = new Vector3(0, 0, 0)

                this.movementSpeed = clamp(
                    this.movementSpeed + (direction * (this.deltaMoveSpeed * delta * this.movementSpeed)),
                    this.minMoveSpeed,
                    this.maxMoveSpeed
                )

                if (Keyboard.KeyA === KeyState.DOWN)
                {
                    movement.X -= 1
                }

                if (Keyboard.KeyD === KeyState.DOWN)
                {
                    movement.X += 1
                }

                if (Keyboard.KeyW === KeyState.DOWN)
                {
                    movement.Z -= 1
                }

                if (Keyboard.KeyS === KeyState.DOWN)
                {
                    movement.Z += 1
                }
                
                if (Mouse.Left === ButtonState.PRESSED ||
                    Mouse.Middle === ButtonState.PRESSED ||
                    Mouse.Right === ButtonState.PRESSED)
                {
                    rotation.Y -= (this.turnSpeed / delta) * Mouse.Offset.X
                    rotation.X -= (this.turnSpeed / delta) * Mouse.Offset.Y
                }

                movement.Normalize().Scale(this.movementSpeed)

                this.transform.Position.Sum(movement)
                this.transform.Rotation.Sum(rotation)
            }
        }))
        
        this.camera = this.GetComponent(Camera)!
        this.transform = this.GetComponent(Transform)!
    }
}
