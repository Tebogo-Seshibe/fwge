import { Component } from "./Component"
import { Class, EntityId, Registry, TypeId } from "./Registry"

export class Library<T extends Component>
{
    private components: Map<string, EntityId> = new Map()
    private componentTypeId: TypeId

    constructor(componentType: Class<T>)
    {
        this.componentTypeId = Registry.getComponentTypeId(componentType)!
    }
    
    Add(name: string, component: T): Library<T>
    {
        this.components.set(name, component.Id)

        if (!Registry.getComponent<T>(component.Type, component.Id))
        {
            Registry.addComponent<T>(component.Type, component)
        }

        return this
    }

    Get(name: string): T
    {
        const componentId = this.components.get(name) ?? -1
        if (componentId === -1)
        {
            throw new Error(`Component with name "${ name }" does not exist`)
        }

        return Registry.getComponent<T>(this.componentTypeId, componentId)!
    }

    Remove(name: string): Library<T>
    {
        this.components.delete(name)

        return this
    }
}
