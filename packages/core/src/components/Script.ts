import { SharedComponent } from "../ecs/Component"

type IScript =
{
    start?: () => void
    update?: (delta?: number) => void
    end?: () => void
}

export class Script extends SharedComponent
{
    readonly Start: () => void
    readonly Update: (delta?: number) => void
    readonly End: () => void

    constructor()
    constructor(args: IScript)
    constructor(args: IScript = { })
    {
        super()

        this.Start = args.start || function() { }
        this.Update = args.update || function() { }
        this.End = args.end || function() { }
    }
}
