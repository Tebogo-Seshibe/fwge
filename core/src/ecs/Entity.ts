import { Scene } from '../base/Scene'
import { Component } from './Component'
import { Class, ComponentId, EntityId } from './Registry'

export class Entity
{
    private _components: Array<Component | undefined> = []
    private _children: Entity[] = []
    private _parent?: Entity
    
    public get Parent(): Entity | undefined
    {
        return this._parent
    }

    public set Parent(parent: EntityId | Entity | undefined)
    {
        const parentId = typeof parent === 'number'
            ? parent
            : parent?.Id

        if (!Number.isNaN(parentId) && parentId !== this.Id)
        {
            this._parent = this._scene.GetEntity(parentId!)
        }
    }
    
    public get Children(): Entity[]
    {
        return this._children
            .filter(x => x !== undefined) as Entity[]
    }

    public get Components(): Component[]
    {
        return this._components.filter(x => x !== undefined) as Component[]
    }

    constructor(
        private _scene: Scene,
        public readonly Id: EntityId = _scene.Registry.createEntity()
    ) { }

    public AddComponent<T extends Component>(component: T): Entity
    {
        component.AddOwner(this)
        if (!component.Id)
        {
            this._scene.Registry.createComponent(component)
        }

        this._components[component.Type._typeIndex!] = component!
        this._scene.OnEntity(this)

        return this
    }

    public GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
      return this._components[componentType._typeIndex!] as T
    }

    public HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return this._components[componentType._typeIndex!] !== undefined
    }
    
    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        const component = this.GetComponent(componentType)
        if (component)
        {
            component.RemoveOwner(this)
        }

        this._components[componentType._typeIndex!] = undefined
        this._scene.OnEntity(this)

        return this
    }
    
    public AddChild(entity: Entity): Entity
    public AddChild(entity: EntityId): Entity
    public AddChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg as Entity
        
        if (child && this.Id !== child.Id && !this._children.includes(child))
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
}
