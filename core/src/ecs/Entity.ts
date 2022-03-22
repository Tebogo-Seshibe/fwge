import { Scene } from '../base/Scene'
import { Component } from './Component'
import { Class, ComponentId, EntityId } from './Registry'

export class Entity
{
    private _components: Array<ComponentId | undefined> = []
    private _children: EntityId[] = []
    private _parent?: EntityId
    
    public get Parent(): Entity | undefined
    {
        return this._parent !== undefined
            ? this._scene.GetEntity(this._parent)
            : undefined
    }

    public set Parent(parent: EntityId | Entity | undefined)
    {
        const parentId = typeof parent === 'number'
            ? parent
            : parent?.Id

        if (parentId !== this.Id)
        {
            this._parent = parentId
        }
    }
    
    public get Children(): Entity[]
    {
        return this._children
            .map(child => this._scene.GetEntity(child))
            .filter(x => x !== undefined) as Entity[]
    }

    public get Components(): Component[]
    {
        return this._components
            .map((componentId, typeId) => this._scene.Registry.getComponent(typeId, componentId)!)
            .filter(x => x !== undefined)
    }

    constructor(
        private _scene: Scene,
        public readonly Id: EntityId = _scene.Registry.createEntity()
    ) { }

    AddComponent<T extends Component>(component: T): Entity
    {
        component.AddOwner(this)
        if (!component.Id)
        {
            this._scene.Registry.createComponent(component)
        }

        this._components[component.Type._typeIndex!] = component.Id!
        this._scene.OnEntity(this)

        return this
    }

    GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
        const componentId = this._components[componentType._typeIndex!]

        return this._scene.Registry.getComponent<T>(componentType._typeIndex!, componentId)
    }

    HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return this._components[componentType._typeIndex!] !== undefined
    }
    
    RemoveComponent<T extends Component>(componentType: Class<T>): Entity
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
    
    AddChild(entity: Entity): Entity
    AddChild(entity: EntityId): Entity
    AddChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg as Entity
        
        if (child && this.Id !== child.Id && !this._children.includes(child.Id))
        {
            this._children.push(child.Id)
            child.Parent = this
        }

        return this
    }

    GetChild(index: number): Entity
    {
        if (index >= this._children.length)
        {
            throw new Error(`Index out of range`)
        }
        
        return this._scene.GetEntity(this._children[index])!
    }

    RemoveChild(arg: Entity): Entity
    RemoveChild(arg: EntityId): Entity
    RemoveChild(arg: EntityId | Entity): Entity
    {
        const entity = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg

        if (this.Id !== entity.Id && this._children.includes(entity.Id))
        {
            this._children = this._children.filter(entityId => entityId !== entity.Id)
            entity.Parent = undefined
        }

        return this
    }
}
