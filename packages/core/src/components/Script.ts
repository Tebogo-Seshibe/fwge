import { Game } from "../base";
import { Component } from "../ecs";

type IScript =
{
    start?: () => void
    update?: (delta: number) => void
    end?: () => void
}

export class Script extends Component
{
    readonly Start: () => void
    readonly Update: (delta: number) => void
    readonly End: () => void

    constructor(game: Game)
    constructor(game: Game, args: IScript)
    constructor(game: Game, args: IScript = { })
    {
        super(game, Script)

        this.Start = args.start || function() { }
        this.Update = args.update || function() { }
        this.End = args.end || function() { }
    }
}
