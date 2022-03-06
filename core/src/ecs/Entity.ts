import { Scene } from '../base/Scene'
import { Component } from './Component'
import { Class, ComponentId, EntityId, Registry } from './Registry'

export class Entity
{
    #components: Map<Class<Component>, ComponentId> = new Map()
    #children: EntityId[] = []
    #parent?: EntityId
    #scene: Scene

    readonly Id: EntityId
    
    get Parent(): Entity | undefined
    {
        return this.#parent !== undefined
            ? this.#scene.GetEntity(this.#parent)
            : undefined
    }

    set Parent(parent: EntityId | Entity | undefined)
    {
        const parentId = typeof parent === 'number'
            ? parent
            : parent?.Id

        if (parentId !== this.Id)
        {
            this.#parent = parentId
        }
    }
    
    get Children(): Entity[]
    {
        return this.#children
            .map(child => this.#scene.GetEntity(child))
            .filter(x => x !== undefined) as Entity[]
    }

    get Components(): Component[]
    {
        const components: Component[] = []

        for (const [type, id] of this.#components)
        {
            components.push(this.#scene.Registry.getComponent(type, id)!)
        }

        return components
    }

    constructor(scene: Scene)
    {
        this.#scene = scene
        this.Id = this.#scene.Registry.createEntity()
    }

    AddComponent<T extends Component>(component: T): Entity
    {
        component.AddParent(this)
        if (!component.Id)
        {
            this.#scene.Registry.createComponent(component)
        }

        this.#components.set(component.Type, component.Id!)
        this.#scene.OnEntity(this)

        return this
    }

    GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
        const componentId = this.#components.get(componentType)

        return this.#scene.Registry.getComponent<T>(componentType, componentId)
    }

    HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return this.#components.has(componentType)
    }
    
    RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        const component = this.GetComponent(componentType)
        if (component)
        {
            component.RemoveParent(this)
        }

        this.#components.delete(componentType)
        this.#scene.OnEntity(this)

        return this
    }
    
    AddChild(entity: Entity): Entity
    AddChild(entity: EntityId): Entity
    AddChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number'
            ? this.#scene.GetEntity(arg)!
            : arg as Entity
        
        if (child && this.Id !== child.Id && !this.#children.includes(child.Id))
        {
            this.#children.push(child.Id)
            child.Parent = this
        }

        return this
    }

    GetChild(index: number): Entity
    {
        if (index >= this.#children.length)
        {
            throw new Error(`Index out of range`)
        }
        
        return this.#scene.GetEntity(this.#children[index])!
    }

    RemoveChild(arg: Entity): Entity
    RemoveChild(arg: EntityId): Entity
    RemoveChild(arg: EntityId | Entity): Entity
    {
        const entity = typeof arg === 'number'
            ? this.#scene.GetEntity(arg)!
            : arg

        if (this.Id !== entity.Id && this.#children.includes(entity.Id))
        {
            this.#children = this.#children.filter(entityId => entityId !== entity.Id)
            entity.Parent = undefined
        }

        return this
    }
}
