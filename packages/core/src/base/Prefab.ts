import { Component } from '../ecs/Component'
import { Entity } from '../ecs/Entity'
import { Class, Constructor, TypeId } from '../ecs/Registry'
import { Scene } from './Scene'


// AddComponent<K extends Component, U extends any[]>(constructor: Constructor<K, U>, ...args: U): Prefab
// {
//     this.components.set(constructor as Class<K>, [ constructor, args ])

//     return this
// }


export class Prefab<K extends Entity>
{
    private _components: Map<TypeId, Component> = new Map()
    private _children: Prefab<Entity>[] = []    
    
    public readonly Type: Constructor<K, [Scene]> = Entity as Constructor<any, [Scene, ...any[]]>

    constructor()
    constructor(entityType: Constructor<K, [Scene]>)
    constructor(entityType?: Constructor<K, [Scene]>)
    {
        if (entityType)
        {
            this.Type = entityType
        }

    }

    AddChild(prefab: Prefab<K>): Prefab<K>
    {
        this._children.push(prefab)
        return this
    }

    AddComponent<U extends Component>(component: U): Prefab<K>
    {
        this._components.set(component.TypeId!, component)

        return this
    }

    GetComponent<U extends Component>(componentType: Class<U>): U | undefined
    {
        return this._components.get(componentType._typeId!) as U
    }

    RemoveComponent<U extends Component>(componentType: Class<U>): Prefab<K>
    {
        this._components.delete(componentType._typeId!)        

        return this
    }

    Instance(scene: Scene): K
    {
        const entity = scene.CreateEntity(this.Type)

        for (let [, component] of this._components)
        {         
            entity.AddComponent(component)
        }

        for (const child of this._children)
        {
            entity.AddChild(child.Instance(scene))
        }

        return entity
    }
}
