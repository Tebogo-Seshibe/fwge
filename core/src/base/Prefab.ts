import { Component } from '../ecs/Component'
import { Entity } from '../ecs/Entity'
import { Class, Constructor } from '../ecs/Registry'
import { Scene } from './Scene'

export class Prefab
{
    private _components: Map<Class<Component>, [ Constructor<Component, any>, any[] ]> = new Map()

    AddComponent<T extends Component, U extends any[]>(constructor: Constructor<T, U>, ...args: U): Prefab
    {
        this._components.set(constructor as Class<T>, [ constructor, args ])

        return this
    }

    RemoveComponent<T extends Component>(componentType: Class<T>): Prefab
    {
        this._components.delete(componentType)        

        return this
    }

    Instance(scene: Scene): Entity
    {
        const entity = scene.CreateEntity()

        for (let [, [ constructor, args ]] of this._components)
        {
            const component = new constructor(...args!)            
            entity.AddComponent(component)
        }

        return entity
    }
}
