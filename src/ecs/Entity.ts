import { TypeId } from '.'
import { Scene } from '../core/Scene'
import { Component } from './Component'
import { Class, ComponentId, EntityId, Registry } from './Registry'

export class Entity
{
    static #entityId: EntityId = 0

    #components: Array<ComponentId | undefined> = []
    #children: EntityId[] = []
    #parent?: EntityId
    #scene: Scene

    readonly Id: EntityId = Entity.#entityId++
    
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

        for (let typeId = 0; typeId < this.#components.length; ++typeId)
        {
            const componentId = this.#components[typeId]
            if (componentId !== undefined)
            {
                components.push(Registry.getEntityComponent(this.#scene.Id, this.Id,typeId)!)
            }
        }

        return components
    }

    constructor(scene: Scene)
    {
        this.#scene = scene
    }

    AddComponent<T extends Component>(component: T): Entity
    {
        Registry.setEntityComponent(this.#scene, this, component)

        component.Parent = this     
        this.#scene.OnEntity(this)

        return this
    }

    GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    {
        return Registry.getEntityComponent(this.#scene, this.Id, componentType)
    }

    HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return this.GetComponent(componentType) !== undefined
    }
    
    RemoveComponent<T extends Component>(type: Class<T>): Entity
    {
        const component = Registry.removeEntityComponent(this.#scene, this, type)
        
        if (component)
        {
            component.Parent = undefined
            this.#scene.OnEntity(this)
        }

        return this
    }
    
    AddChild(entity: Entity): Entity
    AddChild(entity: EntityId): Entity
    AddChild(arg: EntityId | Entity): Entity
    {
        const entity = typeof arg === 'number'
            ? this.#scene.GetEntity(arg)!
            : arg as Entity
        
        if (entity && this.Id !== entity.Id && !this.#children.includes(entity.Id))
        {
            this.#children.push(entity.Id)
            entity.Parent = this
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
