import { Class, ComponentId, Registry, TypeId } from "./Registry";

export abstract class Component<Owner = any>
{
    readonly Id: ComponentId;
    readonly TypeId: TypeId;
    readonly Type: Class<Component>;

    abstract AddOwner(entity: Owner): void;
    abstract RemoveOwner(entity: Owner): void;

    constructor();
    constructor(componentType: Class<Component>);
    constructor(type?: Class<Component>)
    {
        this.Type = type ?? new.target as Class<Component>;
        this.TypeId = this.Type.TypeId!;
        this.Id = Registry.createComponent(this.Type);
    }
}

export abstract class SharedComponent<Owner = any> extends Component
{
    public get Owners(): Owner[]
    {
        return this._owners;
    }

    public AddOwner(entity: Owner): void
    {
        if (!this._owners.includes(entity))
        {
            this._owners.push(entity);
        }
    }

    public RemoveOwner(entity: Owner): void
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

    private _owners: Owner[] = [];
}

export abstract class UniqueComponent<Owner = any> extends Component
{
    public get Owner(): Owner | undefined
    {
        return this._owner;
    }

    public AddOwner(owner: Owner): void
    {
        this._owner = owner;
    }

    public RemoveOwner(_?: Owner): void
    {
        this._owner = undefined;
    }

    private _owner?: Owner;
}
