import { Entity } from "./Entity"
import { Class, ComponentId, nextId } from "./Registry"

let _typeId: number = 0
export abstract class Component
{
    public readonly Id: ComponentId
    public readonly Type: Class<Component>

    constructor()
    constructor(componentType: Class<Component>)
    constructor(type?: Class<Component>)
    {
        this.Type = type ?? new.target as Class<Component>
        if (this.Type._typeId === undefined)
        {
            this.Type._typeId = _typeId++
        }
        this.Id = nextId(this.Type)
    }

    public abstract AddOwner(owner: Entity): void
    public abstract RemoveOwner(owner: Entity): void
}

export abstract class SharedComponent extends Component
{
    private _owners: Entity[] = []

    public get Owners(): Entity[]
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
            const parentIndex = this._owners.indexOf(owner)
            this._owners.swap(parentIndex, this._owners.length - 1)
            this._owners.pop()
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
