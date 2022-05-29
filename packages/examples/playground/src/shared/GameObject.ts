import { Entity, Script, Transform } from "@fwge/core";
import { IsComponent } from './IsComponent'

export class GameObject extends Entity
{
    @IsComponent(Transform)
    public transform!: Transform
    
    OnCreate()
    {
        this.AddComponent(new Script(
        {
            start: () => this.Start(),
            update: delta => this.Update(delta),
            end: () => this.Stop()
        }))
    }

    public Start() {}
    public Update(_: number) {}
    public Stop() {}
}