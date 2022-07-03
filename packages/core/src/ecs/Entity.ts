import { Scene } from '../base/Scene'
import { Component } from './Component'
import { Class, EntityId, RegistryType } from './Registry'

export class Entity extends RegistryType
{
    readonly Scene: Scene

    OnCreate(): void { }
    OnDestroy(): void { }
    
    //#region Properties
    public get Parent(): Entity | undefined
    {
        return this.#parent
    }

    public set Parent(parent: EntityId | Entity | undefined)
    {
        const newParent = typeof parent === 'number'
            ? this.Scene.GetEntity(parent)
            : parent

        if (newParent && newParent !== this)
        {
            this.#parent = newParent
        }
    }
    
    public get Children(): Entity[]
    {
        return this.#children
            .filter(x => x !== undefined) as Entity[]
    }

    public get Components(): { [key: string]: Component }
    {
        return [...this.#components.values()]
            .reduce((prev, curr) => ({ ...prev, [curr!.Type.name]: curr }), { })
    }
    //#endregion

    //#region Component Methods
    public AddComponent<T extends Component>(component: T): Entity
    {
        component.AddOwner(this)
        this.#components.set(component.Type, component)
        this.Scene.OnEntity(this)

        return this
    }

    public GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
        if (!this.#components)
        {
            this.#components = new Map()
        }
        return this.#components.get(componentType) as T
    }

    public HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        if (!this.#components)
        {
            this.#components = new Map()
        }
        return this.#components.has(componentType)
    }
    
    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        if (!this.#components)
        {
            this.#components = new Map()
        }
        const component = this.#components.get(componentType!)
        if (component)
        {
            component.RemoveOwner(this)
            this.#components.delete(component.Type)
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
        const child = typeof arg === 'number'
            ? this.Scene.GetEntity(arg)!
            : arg as Entity
        
        if (child && this !== child && !this.#children.includes(child))
        {
            this.#children.push(child)
            child.Parent = this
        }

        return this
    }

    public GetChild(index: number): Entity
    {
        if (index >= this.#children.length)
        {
            throw new Error(`Index out of range`)
        }
        
        return this.#children[index]
    }

    public RemoveChild(arg: Entity): Entity
    public RemoveChild(arg: EntityId): Entity
    public RemoveChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number'
            ? this.Scene.GetEntity(arg)!
            : arg

        const childIndex = this.#children.indexOf(child)
        if (this.Id !== child.Id && childIndex !== -1)
        {
            this.#children.swap(childIndex, this.#children.length - 1)
            this.#children.pop()
            child.Parent = undefined
        }

        return this
    }
    //#endregion
    
    #children: Entity[] = []
    #parent?: Entity
    #components: Map<Class<Component>, Component> = new Map()

    constructor(scene: Scene)
    {
        super(Entity)
        this.Scene = scene
    }
}
