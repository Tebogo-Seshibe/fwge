import { Entity } from "./Entity"
import { Class, ComponentId } from "./Registry"

export abstract class Component
{
    public Id: ComponentId | undefined

    constructor(
        readonly Type: Class<Component> = new.target as Class<Component>,
    ) { }

    abstract AddOwner(owner: Entity): void
    abstract RemoveOwner(owner: Entity): void
}

export abstract class SharedComponent extends Component
{
    private _owners: Entity[] = []

    get Owners(): Entity[] | undefined
    {
        return this._owners
    }

    AddOwner(owner: Entity)
    {
        if (!this._owners.includes(owner))
        {
            this._owners.push(owner)
        }
    }

    RemoveOwner(owner: Entity)
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

    get Owner(): Entity | undefined
    {
        return this._owner
    }

    AddOwner(owner: Entity)
    {
        this._owner = owner
    }

    RemoveOwner(_?: Entity)
    {
        this._owner = undefined
    }
}
