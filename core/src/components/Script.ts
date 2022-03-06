import { SharedComponent } from "../ecs/Component"
import { Entity } from "../ecs/Entity"

interface IScript
{
    start?: (this: Entity) => void
    update?: (this: Entity, delta: number) => void
    end?: (this: Entity) => void
}

export class Script extends SharedComponent
{
    Start: (this: Entity) => void
    Update: (this: Entity, delta: number) => void
    End: (this: Entity) => void

    constructor()
    constructor(args: IScript)
    constructor(args: IScript = { })
    {
        super()

        this.Start = args.start ?? function(){}
        this.Update = args.update ?? function(){}
        this.End = args.end ?? function(){}
    }
}
