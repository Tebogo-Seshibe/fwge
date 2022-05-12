import { Component } from '../ecs/Component'
import { Entity } from '../ecs/Entity'
import { Class, Constructor, TypeId } from '../ecs/Registry'
import { Scene } from './Scene'


// AddComponent<K extends Component, U extends any[]>(constructor: Constructor<K, U>, ...args: U): Prefab
// {
//     this.components.set(constructor as Class<K>, [ constructor, args ])

//     return this
// }


export class Prefab<K extends Entity, V extends any[] | never>
{
    private _components: Map<TypeId, Component> = new Map()
    private _children: Prefab<Entity, any[]>[] = []    
    
    public readonly Type: Constructor<K, [Scene, ...V]> = Entity as Constructor<K, [Scene, ...any[]]>
    public readonly Args: V

    constructor()
    constructor(entityType: Constructor<K, [Scene, ...V]>, ...entityArgs: V)
    constructor(entityType?: Constructor<K, [Scene, ...V]>, ...entityArgs: V)
    {
        if (entityType)
        {
            this.Type = entityType
        }

        this.Args = entityArgs ?? []

    }

    AddChild(prefab: Prefab<K, any[]>): Prefab<K, V>
    {
        this._children.push(prefab)
        return this
    }

    AddComponent<U extends Component>(component: U): Prefab<K, V>
    {
        this._components.set(component.Type._typeId!, component)

        return this
    }

    GetComponent<U extends Component>(componentType: Class<U>): U | undefined
    {
        return this._components.get(componentType._typeId!) as U
    }

    RemoveComponent<U extends Component>(componentType: Class<U>): Prefab<K, V>
    {
        this._components.delete(componentType._typeId!)        

        return this
    }

    Instance(scene: Scene, ...args: V): K
    {
        const entity = args !== undefined 
            ? scene.CreateEntity(this.Type, ...args)
            : scene.CreateEntity(this.Type, ...this.Args)

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
