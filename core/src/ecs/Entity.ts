import { Scene } from '../base/Scene'
import { Component } from './Component'
import { Class, EntityId, nextId, TypeId } from './Registry'

export class Entity
{
    private static Next: EntityId = 0
    public readonly Id: EntityId

    private _children: Entity[] = []
    private _parent?: Entity
    private _components: Map<TypeId, Component> = new Map()
    
    public get Parent(): Entity | undefined
    {
        return this._parent
    }

    public set Parent(parent: EntityId | Entity | undefined)
    {
        const newParent = typeof parent === 'number'
            ? this._scene.GetEntity(parent)
            : parent

        if (newParent && newParent !== this)
        {
            this._parent = newParent
        }
    }

    public get Scene(): Scene
    {
        return this._scene
    }
    
    public get Children(): Entity[]
    {
        return this._children
            .filter(x => x !== undefined) as Entity[]
    }

    public get Components(): { [key: string]: Component }
    {
        return [...this._components.values()]
            .reduce((prev, curr) => ({...prev, [curr!.Type.name]: curr}), {})
    }

    constructor(private _scene: Scene)
    {
        this.Id = Entity.Next++
    }

    public AddComponent<T extends Component>(component: T): Entity
    {
        component.AddOwner(this)
        this._components.set(component.Type._typeId!, component)
        this._scene.OnEntity(this)

        return this
    }

    public GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
        return this._components.get(componentType._typeId!) as T
    }

    public HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return this._components.has(componentType._typeId!)
    }
    
    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        const component = this._components.get(componentType._typeId!)
        if (component)
        {
            component.RemoveOwner(this)
            this._components.delete(component.Type._typeId!)
            this._scene.OnEntity(this)
        }

        return this
    }
    
    public AddChild(entity: Entity): Entity
    public AddChild(entity: EntityId): Entity
    public AddChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg as Entity
        
        if (child && this !== child && !this._children.includes(child))
        {
            this._children.push(child)
            child.Parent = this
        }

        return this
    }

    public GetChild(index: number): Entity
    {
        if (index >= this._children.length)
        {
            throw new Error(`Index out of range`)
        }
        
        return this._children[index]
    }

    public RemoveChild(arg: Entity): Entity
    public RemoveChild(arg: EntityId): Entity
    public RemoveChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg

        const childIndex = this._children.indexOf(child)
        if (this.Id !== child.Id && childIndex !== -1)
        {
            this._children.swap(childIndex, this._children.length - 1)
            this._children.pop()
            child.Parent = undefined
        }

        return this
    }

    public OnCreate(): void { }
    public OnDestroy(): void { }
}
