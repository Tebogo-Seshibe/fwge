import { SharedComponent } from "../ecs/Component"
import { Entity } from "../ecs/Entity"

interface IScript
{
    start?: () => void
    update?: (delta: number) => void
    end?: () => void
}

export class Script extends SharedComponent
{
    Start: () => void
    Update: (delta: number) => void
    End: () => void

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
