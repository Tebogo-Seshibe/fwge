import { clamp, Vector3 } from "@fwge/common"
import { Entity, Scene, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Material, Mesh, Shader } from "@fwge/render"

export class CharacterController extends Entity
{
    private transform: Transform
    
    private readonly maxMoveSpeed = 0.1
    private readonly minMoveSpeed = 0.01
    private readonly deltaMoveSpeed = 0.01
    private movementSpeed: number = this.minMoveSpeed

    constructor(scene: Scene, args: { material: Material, mesh: Mesh, shader: Shader })
    {
        super(scene)

        const _this: CharacterController = this

        this.AddComponent(args.mesh)
        this.AddComponent(args.material)
        this.AddComponent(args.shader)
        this.transform = this.AddComponent(new Transform()).GetComponent(Transform)!

        this.AddComponent(new Input(
        {
            onInput({ Keyboard }: IInputArgs, delta: number)
            {
                if (Keyboard.KeyF5 !== KeyState.UP)
                {
                    window.location.reload()
                    return
                }

                const movement = new Vector3(0, 0, 0)
                const direction = (Keyboard.KeyShift === KeyState.DOWN) ? 1 : -1

                _this.movementSpeed = clamp(
                    _this.movementSpeed + (direction * (_this.deltaMoveSpeed * delta * _this.movementSpeed)),
                    _this.minMoveSpeed,
                    _this.maxMoveSpeed
                )

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
                    movement.Y += _this.movementSpeed
                }

                if (Keyboard.KeyS === KeyState.DOWN)
                {
                    movement.Y -= _this.movementSpeed
                }

                _this.transform.Position.Sum(movement)
            }
        }))
    }
}
