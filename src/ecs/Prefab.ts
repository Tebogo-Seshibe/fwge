import { Component } from './Component'
import { Entity } from './Entity'
import { Class, Constructor, Registry, TypeId } from './Registry'
import { Scene } from './Scene'

export class Prefab
{
    private _components: Map<TypeId, [ Component ] | [ Constructor<Component, any>, any[] ]> = new Map()

    public AddComponent<T extends Component>(component: T): Prefab
    public AddComponent<T extends Component, U extends any[]>(constructor: Constructor<T, U>, ...args: U): Prefab
    public AddComponent<T extends Component, U extends any[]>(type: Constructor<T, U> | T, ...args: U): Prefab
    {
        if (args && args.length > 0)
        {
            const typeId = Registry.getComponentTypeId(type as Class<T>)
            this._components.set(typeId, [ type as Constructor<T, U>, args ])
        }
        else
        {
            const component = type as T
            this._components.set(component.Type, [component])
        }

        return this
    }

    public RemoveComponent(componentType: TypeId): Prefab
    public RemoveComponent<T extends Component>(componentType: Class<T>): Prefab
    public RemoveComponent<T extends Component>(componentType: TypeId | Class<T>): Prefab
    {
        if (typeof componentType !== 'number')
        {
            componentType =  Registry.getComponentTypeId(componentType)!
        }
        
        this._components.delete(componentType)

        return this
    }

    public Intstance(scene: Scene): Entity
    {
        const entity = scene.CreateEntity(Entity)

        for (const [, [ component, args ]] of this._components)
        {
            if ('Id' in component)
            {
                entity.AddComponent(component)
            }
            else
            {
                entity.AddComponent(new component(...args!))
            }
        }

        return entity
    }
}
