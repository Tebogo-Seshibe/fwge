import { Registry } from "./Registry";
import { type Class } from "./types";

export type ComponentId = number;
export type TypeId = number;

export abstract class Component
{
    readonly Id: ComponentId;
    readonly TypeId: TypeId;
    
    static readonly TypeId: TypeId;

    constructor();
    constructor(componentType: Class<Component>);
    constructor(componentType: Class<Component> = new.target as Class<Component>)
    {
        if (componentType.TypeId === undefined)
        {
            Registry.RegisterComponentType(componentType);
        }

        this.TypeId = componentType.TypeId;
        this.Id = Registry.CreateComponent(componentType.TypeId, this);
    }
}
