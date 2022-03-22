import { SharedComponent } from "../ecs/Component"
import { Class, Registry, ComponentId } from "../ecs/Registry"

export class Library<T extends SharedComponent>
{
    private _components: Map<string, ComponentId> = new Map()

    constructor(
        private _componentType: Class<T>,
        private _registry: Registry
    ) { }
    
    public Add(name: string, component: T): Library<T>
    {
        if (!component.Id)
        {
            this._registry.createComponent(component)
        }
        this._components.set(name, component.Id!)
        return this
    }

    public Get(name: string): T
    {
        const componentId = this._components.get(name)

        if (componentId === undefined)
        {
            throw new Error(`Component with name "${ name }" does not exist`)
        }

        return this._registry.getComponent<T>(this._componentType._typeIndex!, componentId)!
    }

    public Remove(name: string): Library<T>
    {
        this._components.delete(name)

        return this
    }
}
