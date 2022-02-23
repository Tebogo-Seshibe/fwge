import { Component } from "../ecs/Component"
import { Class, Registry, TypeId } from "../ecs/Registry"

export class Library<T extends Component>
{
    #components: Map<string, Component> = new Map()
    #componentTypeId: TypeId

    constructor(componentType: Class<T>)
    {
        this.#componentTypeId = Registry.getComponentType(componentType)!
    }
    
    public Add(name: string, component: T): Library<T>
    {
        this.#components.set(name, component)
        return this
    }

    public Get(name: string): T
    {
        const componentId = this.#components.get(name)

        if (componentId === undefined)
        {
            throw new Error(`Component with name "${ name }" does not exist`)
        }

        return this.#components.get(name)! as T
    }

    public Remove(name: string): Library<T>
    {
        this.#components.delete(name)

        return this
    }
}
