import { Class, ComponentId, Registry, TypeId } from "./Registry"

export abstract class Component
{
    constructor(
        readonly Id: ComponentId = Registry.getNextComponentId(new.target as Class<Component>),
        readonly Type: TypeId = Registry.getComponentTypeId(new.target as Class<Component>)
    ) { }
}
