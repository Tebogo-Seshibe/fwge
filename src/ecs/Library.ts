import { Component } from "./Component"
import { Class, EntityId, Registry, TypeId } from "./Registry"

export class Library<T extends Component>
{
    #components: Map<string, EntityId> = new Map()
    #componentTypeId: TypeId

    constructor(componentType: Class<T>)
    {
        this.#componentTypeId = Registry.getComponentTypeId(componentType)!
    }
    
    public Add(name: string, component: T): Library<T>
    {
        this.#components.set(name, component.Id)

        if (!Registry.getComponent<T>(component.Type, component.Id))
        {
            Registry.addComponent<T>(component.Type, component)
        }

        return this
    }

    public Get(name: string): T
    {
        const componentId = this.#components.get(name)

        if (componentId === undefined)
        {
            throw new Error(`Component with name "${ name }" does not exist`)
        }

        return Registry.getComponent<T>(this.#componentTypeId, componentId)!
    }

    public Remove(name: string): Library<T>
    {
        this.#components.delete(name)

        return this
    }
}
