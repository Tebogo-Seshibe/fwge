import { Scene } from '../base/Scene'
import { Component } from './Component'
import { addComponent, Class, createEntity, deleteEntity, EntityId, getAllComponents, getComponent, hasComponent, removeComponent } from './Registry'

export class Entity
{
    public readonly Id: EntityId = createEntity()

    private _scene: Scene
    private _parentId: EntityId = -1
    private _childrenIds: EntityId[] = []

    constructor(scene: Scene)
    {
        this._scene = scene
    }
    
    //#region Properties
    public get Scene(): Scene
    {
        return this._scene
    }
    
    public get Parent(): Entity | undefined
    {
        return this._scene.GetEntity(this._parentId)
    }

    public set Parent(parent: Entity| EntityId | undefined)
    {
        if (parent === undefined)
        {
            this._parentId = -1
        }
        else if (typeof parent === 'number')
        {
            this._parentId = parent
        }
        else
        {
            this._parentId = parent.Id
        }
    }
    
    public get Children(): Entity[]
    {
        const entities: Entity[] = []
        for (let i = 0; i < this._childrenIds.length; ++i)
        {
            entities.push(this.Scene.GetEntity(this._childrenIds[i])!)
        }            
        return entities
    }

    public get Components(): { [key: string]: Component }
    {
        return getAllComponents(this.Id).reduce((prev, component) => ({ ...prev, [component.Type.name]: component }), { })
    }
    //#endregion

    //#region Component Methods
    public AddComponent<T extends Component>(component: T): Entity
    {
        component.AddOwner(this)
        addComponent(this.Id, component)

        return this
    }

    public GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    public GetComponent<T extends Component, U extends T = T>(componentType: Class<T>, childComponentType: Class<U>): U | undefined
    public GetComponent<T extends Component, U extends T = T>(componentType: Class<T>, _?: Class<U>): U | undefined
    {
        return getComponent(this.Id, componentType) as U
    }

    public HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return hasComponent(this.Id, componentType)
    }
    
    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        const component = removeComponent(this.Id, componentType)

        if (component)
        {
            component.RemoveOwner(this)
            this.Scene.OnEntity(this)
        }

        return this
    }
    //#endregion
    
    //#region Children Entity Methods
    public AddChild(entity: Entity): Entity
    public AddChild(entity: EntityId): Entity
    public AddChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number' ? arg : arg.Id

        if (child !== this.Id && !this._childrenIds.includes(child))
        {
            this._childrenIds.push(child)
            this.Scene.GetEntity(child)!.Parent = this
        }

        return this
    }

    public GetChild(index: number): Entity
    {
        if (index >= this._childrenIds.length)
        {
            throw new Error(`Index out of range`)
        }
        
        return this.Scene.GetEntity(this._childrenIds[index])!
    }

    public RemoveChild(arg: Entity): Entity
    public RemoveChild(arg: EntityId): Entity
    public RemoveChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number' ? arg : arg.Id
        const index = this._childrenIds.indexOf(child)

        if (index !== -1)
        {
            this._childrenIds.swap(index, this._childrenIds.length - 1)
            this._childrenIds.pop()
            this.Scene.GetEntity(child)!.Parent = undefined
        }

        return this
    }
    //#endregion

    //#region Lifecycle
    public Destroy()
    {
        this._scene.RemoveEntity(this.Id)

        this._scene = undefined!
        this._parentId = undefined!
        this._childrenIds = undefined!

        deleteEntity(this.Id)
    }
 
    OnCreate(): void { }
    OnDestroy(): void { }
    //#endregion
}