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
    public readonly Start: <T extends Entity>(this: T) => void
    public readonly Update: <T extends Entity>(this: T, delta: number) => void
    public readonly End: <T extends Entity>(this: T) => void
    
    public readonly CollisionStart: <T extends Entity>(this: T, event: any) => void
    public readonly CollisionUpdate: <T extends Entity>(this: T, delta: number, event: any) => void
    public readonly CollisionEnd: <T extends Entity>(this: T, event: any) => void

    constructor()
    constructor(args: IScript)
    constructor(args: IScript =
    {
        start: function(){},
        update: function(){},
        end: function(){},

        collisionStart: function(){},
        collisionUpdate: function(){},
        collisionEnd: function(){}
    })
    {
        super(Script)

        this.Start = args.start!
        this.Update = args.update!
        this.End = args.end!

        this.CollisionStart = args.collisionStart!
        this.CollisionUpdate = args.collisionUpdate!
        this.CollisionEnd = args.collisionEnd!
    }
}
