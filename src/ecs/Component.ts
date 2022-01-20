import { Entity } from "./Entity"
import { Class, ComponentId, Registry, TypeId } from "./Registry"

export abstract class Component
{
    #parent?: Entity

    get Parent(): Entity | undefined
    {
        return this.#parent
    }

    set Parent(parent: Entity | undefined)
    {
        this.#parent = parent
    }

    constructor(
        readonly Id: ComponentId = Registry.getNextComponentId(new.target as unknown as Class<Component>),
        readonly Type: TypeId = Registry.getComponentTypeId(new.target as unknown as Class<Component>),
    ) { }
}
