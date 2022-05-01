import { Component } from '../ecs/Component'
import { Entity } from '../ecs/Entity'
import { Class, TypeId } from '../ecs/Registry'
import { Scene } from './Scene'
export class Prefab
{
    private _components: Map<TypeId, Component> = new Map()
    private _children: Prefab[] = []

    AddChild(prefab: Prefab): Prefab
    {
        this._children.push(prefab)
        return this
    }

    AddComponent<T extends Component>(component: T): Prefab
    {
        this._components.set(component.Type._typeId!, component)

        return this
    }

    GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
        return this._components.get(componentType._typeId!) as T
    }

    RemoveComponent<T extends Component>(componentType: Class<T>): Prefab
    {
        this._components.delete(componentType._typeId!)        

        return this
    }

    Instance(scene: Scene): Entity
    {
        const entity = scene.CreateEntity()

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
