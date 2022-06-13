import { Entity, FWGEComponent, Script, Transform } from "@fwge/core"
import { IInputArgs, Input } from "@fwge/input"

export class GameObject extends Entity
{
    @FWGEComponent()
    public transform!: Transform

    OnCreate(): void
    {
        this.transform = new Transform()
        this.AddComponent(new Script(
        {
            start: () => this.Start(),
            update: (delta) => this.Update(delta),
            end: () => this.Stop()
        }))
        this.AddComponent(new Input(
        {
            onInput: (input, delta) => this.Input(input, delta) 
        }))
    }

    Start(): void { }
    Update(_: number): void { }
    Stop(): void { }

    Input(_0: IInputArgs, _1: number): void { }
}
