import { Entity } from "./Entity"
import { Class, ComponentId } from "./Registry"

export abstract class Component
{
    public Id: ComponentId | undefined

    constructor(
        readonly Type: Class<Component> = new.target as Class<Component>,
    ) { }

    public abstract AddOwner(owner: Entity): void
    public abstract RemoveOwner(owner: Entity): void
}

export abstract class SharedComponent extends Component
{
    private _owners: Entity[] = []

    public get Owners(): Entity[] | undefined
    {
        return this._owners
    }

    public AddOwner(owner: Entity)
    {
        if (!this._owners.includes(owner))
        {
            this._owners.push(owner)
        }
    }

    public RemoveOwner(owner: Entity)
    {
        if (this._owners.includes(owner))
        {
            this._owners.splice(this._owners.indexOf(owner, 1))
        }
    }
}

export abstract class UniqueComponent extends Component
{
    private _owner?: Entity

    public get Owner(): Entity | undefined
    {
        return this._owner
    }

    public AddOwner(owner: Entity)
    {
        this._owner = owner
    }

    public RemoveOwner(_?: Entity)
    {
        this._owner = undefined
    }
}
