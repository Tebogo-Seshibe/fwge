import { Entity } from "./Entity"
import { Class, Registry, TypeId } from "./Registry"

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
        readonly TypeId: TypeId = Registry.getComponentType(new.target as unknown as Class<Component>),
        readonly Type: Class<Component> = new.target as unknown as Class<Component>,
    ) { }
}
