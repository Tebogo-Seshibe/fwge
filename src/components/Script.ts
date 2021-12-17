import { Component } from "../ecs/Component"
import { Entity } from "../ecs/Entity"

interface IScript
{
    start?: <T extends Entity>(this: T) => void
    update?: <T extends Entity>(this: T, delta: number) => void
    end?: <T extends Entity>(this: T) => void
}

export class Script extends Component
{
    public readonly Start: <T extends Entity>(this: T) => void
    public readonly Update: <T extends Entity>(this: T, delta: number) => void
    public readonly End: <T extends Entity>(this: T) => void

    constructor(args: IScript)
    {
        super(Script)

        const { start, update, end }: IScript = args
        
        this.Start = start ?? function(){}
        this.Update = update ?? function(){}
        this.End = end ?? function(){}
    }
}