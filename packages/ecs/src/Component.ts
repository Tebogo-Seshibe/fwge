import { Registry } from "./Registry";
import { type Type, type Class } from "./Class";

export type ComponentId = number;
export type TypeId = number;

export abstract class Component
{
    public readonly Id: ComponentId;
    public readonly TypeId: TypeId;
    
    public static readonly TypeId: TypeId;

    constructor();
    constructor(componentType: Type<Component>);
    constructor(componentType: Type<Component> = new.target as any)
    {
        const _class = componentType = componentType as Class<Component>;
        if (_class.TypeId === undefined)
        {
            Registry.RegisterComponentType(_class);
        }

        this.TypeId = _class.TypeId;
        this.Id = Registry.CreateComponent(_class.TypeId, this);
    }
}
