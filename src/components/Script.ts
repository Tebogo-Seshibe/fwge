import { Component } from "../ecs/Component"
import { Entity } from "../ecs/Entity"

interface IScript
{
    start?: <T extends Entity>(this: T) => void
    update?: <T extends Entity>(this: T, delta: number) => void
    end?: <T extends Entity>(this: T) => void
    collisionStart?: <T extends Entity>(this: T, event: any) => void
    collisionUpdate?: <T extends Entity>(this: T, delta: number, event: any) => void
    collisionEnd?: <T extends Entity>(this: T, event: any) => void
}

export class Script extends Component
{
    Start: <T extends Entity>(this: T) => void
    Update: <T extends Entity>(this: T, delta: number) => void
    End: <T extends Entity>(this: T) => void   
    CollisionStart: <T extends Entity>(this: T, event: any) => void
    CollisionUpdate: <T extends Entity>(this: T, delta: number, event: any) => void
    CollisionEnd: <T extends Entity>(this: T, event: any) => void

    constructor()
    constructor(args: IScript)
    constructor(args: IScript = { })
    {
        super()

        this.Start = args.start ?? function(){}
        this.Update = args.update ?? function(){}
        this.End = args.end ?? function(){}
        this.CollisionStart = args.collisionStart ?? function(){}
        this.CollisionUpdate = args.collisionUpdate ?? function(){}
        this.CollisionEnd = args.collisionEnd ?? function(){}
    }
}
