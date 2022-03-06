import { clamp, Vector3 } from "@fwge/common"
import { Entity, Scene, Transform } from "@fwge/core"
import { ButtonState, IInputArgs, Input, KeyState } from "@fwge/input"

export class MovableEntity extends Entity
{
    private readonly maxMoveSpeed = 0.1
    private readonly minMoveSpeed = 0.01
    private readonly deltaMoveSpeed = 0.01
    private readonly turnSpeed = 5

    private movementSpeed: number = this.minMoveSpeed

    private transform: Transform

    constructor(scene: Scene)
    {
        super(scene)
        const _this = this

        this.AddComponent(new Transform(
        {
            position: new Vector3(0, 0, -15)
        }))

        this.AddComponent(new Input(
        {
            onInput({ Keyboard, Mouse }: IInputArgs, delta: number)
            {
                if (Keyboard.KeyF5 !== KeyState.UP)
                {
                    window.location.reload()
                }

                const direction = (Keyboard.KeyShift === KeyState.DOWN) ? 1 : -1

                _this.movementSpeed = clamp(
                    _this.movementSpeed + (direction * (_this.deltaMoveSpeed * delta * _this.movementSpeed)),
                    _this.minMoveSpeed,
                    _this.maxMoveSpeed
                )

                const movement = new Vector3(0, 0, 0)
                const rotation = new Vector3(0, 0, 0)

                if (Keyboard.KeyA === KeyState.DOWN)
                {
                    movement.X -= _this.movementSpeed
                }

                if (Keyboard.KeyD === KeyState.DOWN)
                {
                    movement.X += _this.movementSpeed
                }

                if (Keyboard.KeyW === KeyState.DOWN)
                {
                    movement.Z -= _this.movementSpeed
                }

                if (Keyboard.KeyS === KeyState.DOWN)
                {
                    movement.Z += _this.movementSpeed
                }

                if (Mouse.Left === ButtonState.PRESSED ||
                    Mouse.Middle === ButtonState.PRESSED ||
                    Mouse.Right === ButtonState.PRESSED)
                {
                    rotation.Y = -(_this.turnSpeed / delta) * Mouse.Offset.X
                    rotation.X = -(_this.turnSpeed / delta) * Mouse.Offset.Y
                }

                _this.transform.Position.Sum(movement)
                _this.transform.Rotation.Sum(rotation)
            }
        }))

        this.transform = this.GetComponent(Transform)!
    }
}
