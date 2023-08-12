import { Component } from '../ecs/Component';
import { Entity } from '../ecs/Entity';
import { Class, Constructor, TypeId } from '../ecs/Registry';
import { Scene } from './Scene';

export class Prefab<K extends Entity = Entity>
{
    private _components: Map<TypeId, Component> = new Map()
    private _children: Prefab<Entity>[] = []    
    
    public readonly Type: Constructor<K, [Scene]> = Entity as Constructor<any, [Scene, ...any[]]>

    constructor()
    constructor(entityType: Constructor<K, [Scene]>)
    constructor(entityType: Constructor<K, [Scene]> = Entity as Constructor<K, [Scene]>)
    {
        if (entityType)
        {
            this.Type = entityType
        }

    }

    AddChild<V extends Entity = Entity>(prefab: Prefab<V>): Prefab<K>
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
        return this._components.get(componentType.TypeId!) as U
    }

    RemoveComponent<U extends Component>(componentType: Class<U>): Prefab<K>
    {
        this._components.delete(componentType.TypeId!)
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
