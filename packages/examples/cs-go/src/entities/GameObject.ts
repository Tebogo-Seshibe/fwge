import { Entity, Scene, Script, Transform } from "@fwge/core"
import { IInputArgs, Input } from "@fwge/input"

export class GameObject extends Entity
{
    public readonly transform: Transform

    constructor(scene: Scene)
    {
        super(scene)
        
        this.AddComponent(new Transform())
        this.AddComponent(new Input(
        {
            onInput(this: GameObject, input: IInputArgs, delta: number)
            {
                this.OnInput(input, delta)
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

    OnStart(): void { }
    OnUpdate(delta: number): void { }
    OnStop(): void { }
    OnInput(args: IInputArgs, delta: number): void { }
}
