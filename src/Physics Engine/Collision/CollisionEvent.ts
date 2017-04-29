export interface ICollisionEvent
{
    Current: GameObject;
    Other: GameObject;
}

/**
 * @name        CollisionEvent
 * @description A collision event object
 * @module      FWGE.Physics
 */
export class CollisionEvent extends Event
{
    public readonly Current: GameObject;
    public readonly Other: GameObject;
    public readonly TimeStamp: string;

    constructor(request: ICollisionEvent)
    {
        super("COLLISIONEVENT");

        this.Current = request.Current;
        this.Other = request.Other;
        this.TimeStamp = new Date(Date.now()).toDateString();
    }
}
