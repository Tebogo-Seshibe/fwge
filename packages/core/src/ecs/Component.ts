import { Entity } from "./Entity"
import { Class, createComponent, RegistryType } from "./Registry"

export class Component extends RegistryType
{
    AddOwner(entitiy: Entity): void { }
    RemoveOwner(entity: Entity): void { }

    constructor()
    constructor(componentType: Class<Component>)
    constructor(type?: Class<Component>)
    {
        super(type)

        createComponent(this)
    }
}

export abstract class SharedComponent extends Component
{
    public get Owners(): Entity[]
    {
        return this._owners
    }

    public AddOwner(entity: Entity): void
    {
        if (!this._owners.includes(entity))
        {
            this._owners.push(entity)
        }
    }

    public RemoveOwner(entity: Entity): void
    {
        const parentIndex = this._owners.indexOf(entity)

        if (parentIndex !== -1)
        {
            this._owners.swap(parentIndex, this._owners.length - 1)
            this._owners.pop()
        }
    }

    private _owners: Entity[] = []
}

export abstract class UniqueComponent extends Component
{
    public get Owner(): Entity | undefined
    {
        return this._owner
    }

    public AddOwner(owner: Entity): void
    {
        this._owner = owner
    }

    public RemoveOwner(_?: Entity): void
    {
        this._owner = undefined
    }

    private _owner?: Entity
}
