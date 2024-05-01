import { Scene, Script, Transform } from "@fwge/core"
import { Entity } from "@fwge/ecs";
import { Input, type IInputArgs } from "@fwge/input"

export class GameObject extends Entity
{
    public readonly transform: Transform

    constructor(protected Scene: Scene)
    {
        super()
        
        this.AddComponent(new Transform())
        this.AddComponent(new Input(
        {
            onInput: (delta, keyboard, mouse, controllers) => {
                this.OnInput({ Controllers: controllers as any, Keyboard: keyboard, Mouse: mouse }, delta)
            }
        }))
        this.AddComponent(new Script(
        {
            start(this: GameObject)
            {
                this.OnStart()
            },
            update(this: GameObject, delta: number)
            {
                this.OnUpdate(delta)
            },
            end(this: GameObject)
            {
                this.OnStop()
            }
        }))

        this.transform = this.GetComponent(Transform)!
    }

    OnCreate(): void { }
    OnStart(): void { }
    OnUpdate(_delta: number): void { }
    OnStop(): void { }
    OnInput(_args: IInputArgs, _delta: number): void { }
}
