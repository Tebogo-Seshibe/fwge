import { Component } from "./Component"
import { Class, EntityId, Registry, TypeId } from "./Registry"

export class Library<T extends Component>
{
    private _components: Map<string, EntityId> = new Map()
    private _componentTypeId: TypeId

    constructor(componentType: Class<T>)
    {
        this._componentTypeId = Registry.getComponentTypeId(componentType)!
    }
    
    public Add(name: string, component: T): Library<T>
    {
        this._components.set(name, component.Id)

        if (!Registry.getComponent<T>(component.Type, component.Id))
        {
            Registry.addComponent<T>(component.Type, component)
        }

        return this
    }

    public Get(name: string): T
    {
        const componentId = this._components.get(name) ?? -1
        if (componentId === -1)
        {
            throw new Error(`Component with name "${ name }" does not exist`)
        }

        return Registry.getComponent<T>(this._componentTypeId, componentId)!
    }

    public Remove(name: string): Library<T>
    {
        this._components.delete(name)

        return this
    }
}
