import { Component } from '../ecs/Component'
import { Entity } from '../ecs/Entity'
import { Class, Constructor, Registry, TypeId } from '../ecs/Registry'
import { Scene } from './Scene'

export class Prefab
{
    #components: Map<TypeId, [ Constructor<Component, any>, any[] ]> = new Map()

    AddComponent<T extends Component, U extends any[]>(constructor: Constructor<T, U>, ...args: U): Prefab
    {
        const typeId = Registry.getComponentTypeId(constructor as Class<T>)
        this.#components.set(typeId, [ constructor, args ])

        return this
    }

    RemoveComponent<T extends Component>(componentType: Class<T>): Prefab
    {
        const typeId =  Registry.getComponentTypeId(componentType)!
        this.#components.delete(typeId)        

        return this
    }

    Instance(scene: Scene): Entity
    {
        const entity = scene.CreateEntity()

        for (let [, [ constructor, args ]] of this.#components)
        {
            const component = new constructor(...args!)            
            entity.AddComponent(component)
        }

        return entity
    }
}
