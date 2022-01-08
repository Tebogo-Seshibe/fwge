import { Component } from './Component'
import { Class, ComponentId, EntityId, Registry } from './Registry'
import { Scene } from './Scene'

export class Entity
{
    private _components: Array<ComponentId | undefined> = []
    private _children: EntityId[] = []
    private _parent?: EntityId

    public readonly Id: EntityId
    
    public get Parent(): Entity | undefined
    {
        return this._parent !== undefined
            ? this._scene.GetEntity(this._parent)
            : undefined
    }

    constructor(private readonly _scene: Scene)
    {
        this.Id = Registry.createEntity()
    }

    //#region Component
    public AddComponent<T extends Component>(component: T): Entity
    {
        Registry.addComponent(component.Type, component)
        Registry.attachComponent(this.Id, component)

        this._components[component.Type] = component.Id
        
        this._scene.OnEntity(this)

        return this
    }

    public GetComponent<T extends Component>(type: Class<T>): T | undefined
    {
        const typeId = Registry.getComponentTypeId(type)!

        return Registry.getComponent(typeId, this._components[typeId]!)
    }

    public HasComponent<T extends Component>(type: Class<T>): boolean
    {
        return Boolean(this._components[Registry.getComponentTypeId(type)])
    }
    
    public RemoveComponent<T extends Component>(type: Class<T>): Entity
    {
        const component = this.GetComponent(type)

        if (component)
        {
            Registry.detachComponent(this.Id, component)
            this._components[component.Type] = undefined
        }

        this._scene.OnEntity(this)
        
        return this
    }
    //#endregion

    //#region Children Entity
    public SetParent(entity?: Entity): void
    {
        this._parent = entity?.Id
    }

    public AddChild(entity: Entity): Entity
    public AddChild(entity: EntityId): Entity
    public AddChild(arg: EntityId | Entity): Entity
    {
        const entity = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg

        if (this.Id !== entity.Id && !this._children.includes(entity.Id))
        {
            this._children.push(entity.Id)
            entity.SetParent(this)
        }

        return this
    }

    public GetChildren(): Entity[]
    {
        return this._children.map((_, index) => this.GetChild(index))
    }

    public GetChild(index: number): Entity
    {
        if (index >= this._children.length)
        {
            throw new Error(`Index out of range`)
        }
        
        return this._scene.GetEntity(this._children[index])!
    }

    public RemoveChild(arg: Entity): Entity
    public RemoveChild(arg: EntityId): Entity
    public RemoveChild(arg: EntityId | Entity): Entity
    {
        const entity = typeof arg === 'number'
            ? this._scene.GetEntity(arg)!
            : arg

        if (this.Id !== entity.Id && this._children.includes(entity.Id))
        {
            this._children = this._children.filter(entityId => entityId !== entity.Id)
            entity.SetParent(this)
        }

        return this
    }
    //#endregion
}
