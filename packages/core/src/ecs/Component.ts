import { Entity } from "./Entity"
import { Class, RegistryType } from "./Registry"

export class Component extends RegistryType
{
    AddOwner(entitiy: Entity): void { }
    RemoveOwner(entity: Entity): void { }

    constructor()
    constructor(componentType: Class<Component>)
    constructor(type?: Class<Component>)
    {
        super(type)
    }
}

export abstract class SharedComponent extends Component
{
    public get Owners(): Entity[]
    {
        return this.#owners
    }

    public AddOwner(entity: Entity): void
    {
        if (!this.#owners.includes(entity))
        {
            this.#owners.push(entity)
        }
    }

    public RemoveOwner(entity: Entity): void
    {
        const parentIndex = this.#owners.indexOf(entity)

        if (parentIndex !== -1)
        {
            this.#owners.swap(parentIndex, this.#owners.length - 1)
            this.#owners.pop()
        }
    }

    #owners: Entity[] = []
}

export abstract class UniqueComponent extends Component
{
    public get Owner(): Entity | undefined
    {
        return this.#owner
    }

    public AddOwner(owner: Entity): void
    {
        this.#owner = owner
    }

    public RemoveOwner(_?: Entity): void
    {
        this.#owner = undefined
    }

    #owner?: Entity
}
