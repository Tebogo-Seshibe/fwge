import { Class, ComponentId, Registry, TypeId } from "./Registry"

export abstract class Component
{
    public readonly Id: ComponentId
    public readonly Type: TypeId

    constructor(componentType: Class<Component>)
    {
        this.Id = Registry.getNextComponentId(componentType)
        this.Type = Registry.getComponentTypeId(componentType)!
    }
}
