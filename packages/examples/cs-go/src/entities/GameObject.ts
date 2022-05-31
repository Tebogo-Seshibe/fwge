import { Entity, FWGEComponent, Script, Transform } from "@fwge/core"

export class GameObject extends Entity
{
    @FWGEComponent(Transform)
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
    }

    Start(): void { }
    Update(_: number): void { }
    Stop(): void { }
}
