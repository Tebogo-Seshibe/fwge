import { SharedComponent } from "../ecs/Component"
import { Class } from "../ecs/Registry"

export class Library<T extends SharedComponent>
{
    private _components: Map<string, SharedComponent> = new Map()

    constructor(
        private _componentType: Class<T>
    ) { }
    
    public Add(name: string, component: T): Library<T>
    {
        this._components.set(name, component)
        return this
    }

    public Get(name: string): T
    {
        const component = this._components.get(name)

        if (component === undefined)
        {
            throw new Error(`Component with name "${ name }" does not exist`)
        }

        return component as T
    }

    public Remove(name: string): Library<T>
    {
        this._components.delete(name)

        return this
    }
}
