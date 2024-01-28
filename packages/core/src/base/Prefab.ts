import { Entity, type Class, type Component, type Constructor, type TypeId } from '@fwge/ecs';

export class Prefab<K extends Entity = Entity>
{
    private _components: Map<TypeId, Component> = new Map()
    private _children: Prefab<Entity>[] = []    
    
    public readonly Type: Constructor<K, any[]> = Entity as Constructor<any, any[]>

    constructor()
    constructor(entityType: Constructor<K, any[]>)
    constructor(entityType: Constructor<K, any[]> = Entity as Constructor<K, any[]>)
    {
        if (entityType)
        {
            this.Type = entityType
        }
    }

    public AddChild<V extends Entity = Entity>(prefab: Prefab<V>): Prefab<K>
    {
        this._children.push(prefab)
        return this
    }

    public AddComponent<U extends Component>(component: U): Prefab<K>
    {
        this._components.set(component.TypeId!, component)

        return this
    }

    public GetComponent<U extends Component>(componentType: Class<U>): U | undefined
    {
        return this._components.get(componentType.TypeId!) as U
    }

    public RemoveComponent<U extends Component>(componentType: Class<U>): Prefab<K>
    {
        this._components.delete(componentType.TypeId!)
        return this
    }

    public Instance(): K
    {
        const entity = new this.Type();

        for (let [, component] of this._components)
        {         
            entity.AddComponent(component);
        }

        for (const child of this._children)
        {
            entity.AddChild(child.Instance());
        }

        return entity;
    }
}
