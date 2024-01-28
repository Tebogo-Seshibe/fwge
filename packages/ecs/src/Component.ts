import { Registry } from "./Registry";
import { type Type, type Class } from "./Class";

export type ComponentId = number;
export type TypeId = number;

export abstract class Component
{
    readonly Id: ComponentId;
    readonly TypeId: TypeId;
    
    static readonly TypeId: TypeId;

    constructor();
    constructor(componentType: Type<Component>);
    constructor(componentType: Type<Component> = new.target as any)
    {
        const _class = componentType = componentType as Class<Component>;
        console.log({ _class })
        if (_class.TypeId === undefined)
        {
            Registry.RegisterComponentType(_class);
        }

        this.TypeId = _class.TypeId;
        this.Id = Registry.CreateComponent(_class.TypeId, this);
    }
}
