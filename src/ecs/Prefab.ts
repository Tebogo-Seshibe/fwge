import { Component } from './Component'
import { Entity } from './Entity'
import { Class, Constructor, Registry, TypeId } from './Registry'
import { Scene } from './Scene'

export class Prefab
{
    #components: Map<TypeId, [ Component ] | [ Constructor<Component, any>, any[] ]> = new Map()

    AddComponent<T extends Component>(component: T): Prefab
    AddComponent<T extends Component, U extends any[]>(constructor: Constructor<T, U>, ...args: U): Prefab
    AddComponent<T extends Component, U extends any[]>(type: Constructor<T, U> | T, ...args: U): Prefab
    {
        if (args && args.length > 0)
        {
            const typeId = Registry.getComponentTypeId(type as Class<T>)
            this.#components.set(typeId, [ type as Constructor<T, U>, args ])
        }
        else
        {
            const component = type as T
            this.#components.set(component.Type, [component])
        }

        return this
    }

    RemoveComponent(componentType: TypeId): Prefab
    RemoveComponent<T extends Component>(componentType: Class<T>): Prefab
    RemoveComponent<T extends Component>(componentType: TypeId | Class<T>): Prefab
    {
        if (typeof componentType !== 'number')
        {
            componentType =  Registry.getComponentTypeId(componentType)!
        }
        
        this.#components.delete(componentType)

        return this
    }

    Intstance(scene: Scene): Entity
    {
        const entity = scene.CreateEntity()

        for (let [, [ component, args ]] of this.#components)
        {
            const isClass = typeof (component as Constructor<any, any>) === 'function'
            
            if (isClass)
            {
                component = new (component as Constructor<any, any>)(...args!)
            }
            
            entity.AddComponent(component as Component)
        }

        return entity
    }
}
