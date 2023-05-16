import { Entity } from "./Entity";
import { Class, ComponentId, Registry, TypeId } from "./Registry";

export abstract class Component
{
    readonly Id: ComponentId;
    readonly TypeId: TypeId;
    readonly Type: Class<Component>;

    abstract AddOwner(entity: Entity): void;
    abstract RemoveOwner(entity: Entity): void;

    constructor();
    constructor(componentType: Class<Component>);
    constructor(type?: Class<Component>)
    {
        this.Type = type ?? new.target as Class<Component>;
        this.TypeId = this.Type.TypeId!;
        this.Id = Registry.createComponent(this);
    }

    Destroy(): void
    {
        Registry.deleteComponent(this);
    }
}

export abstract class SharedComponent extends Component
{
    public get Owners(): Entity[]
    {
        return this._owners;
    }

    public AddOwner(entity: Entity): void
    {
        if (!this._owners.includes(entity))
        {
            this._owners.push(entity);
        }
    }

    public RemoveOwner(entity: Entity): void
    {
        const parentIndex = this._owners.indexOf(entity);

        if (parentIndex !== -1)
        {
            if (this._owners.length > 1)
            {
                this._owners[parentIndex] = this._owners[this._owners.length - 1];
            }
            
            this._owners.pop();
        }
    }

    override Destroy(): void
    {
        for (let i= 0; i < this._owners.length; ++i)
        {
            this._owners[i].RemoveComponent(this.Type);
        }

        super.Destroy();
    }

    private _owners: Entity[] = [];
}

export abstract class UniqueComponent extends Component
{
    public get Owner(): Entity | undefined
    {
        return this._owner;
    }

    public AddOwner(owner: Entity): void
    {
        this._owner = owner;
    }

    public RemoveOwner(_?: Entity): void
    {
        this._owner = undefined;
    }

    override Destroy(): void
    {
        this._owner?.RemoveComponent(this.Type);
        super.Destroy();
    }

    private _owner?: Entity;
}
