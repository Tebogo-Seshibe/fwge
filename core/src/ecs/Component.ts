import { Entity } from "./Entity"
import { Class, ComponentId } from "./Registry"

export abstract class Component
{
    public Id: ComponentId | undefined
    protected parents: Entity[] = []
    
    get Parents(): Entity[] | undefined
    {
        return this.parents
    }

    get Parent(): Entity | undefined
    {
        return this.parents[0]
    }

    constructor(
        readonly Type: Class<Component> = new.target as Class<Component>,
    ) { }

    abstract AddParent(parent: Entity): void
    abstract RemoveParent(parent: Entity): void
}


export class SharedComponent extends Component
{
    readonly shared = true

    AddParent(parent: Entity)
    {
        if (!this.parents.includes(parent))
        {
            this.parents.push(parent)
        }
    }

    RemoveParent(parent: Entity)
    {
        if (this.parents.includes(parent))
        {
            this.parents = this.parents.filter(x => x !== parent)
        }
    }
}

export class UniqueComponent extends Component
{
    readonly unique = true

    AddParent(parent: Entity)
    {
        this.parents[0] = parent
    }

    RemoveParent(parent: Entity)
    {
        if (this.parents.includes(parent))
        {
            this.parents = []
        }
    }
}

