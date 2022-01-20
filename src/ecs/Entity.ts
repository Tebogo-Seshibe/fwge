import { TypeId } from '.'
import { Component } from './Component'
import { Class, ComponentId, EntityId, Registry } from './Registry'
import { Scene } from './Scene'

export class Entity
{
    #components: Array<ComponentId | undefined> = []
    #children: EntityId[] = []
    #parent?: EntityId
    #scene: Scene

    readonly Id: EntityId = Registry.createEntity()
    
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
                components.push(Registry.getComponent(typeId, componentId!)!)
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
        Registry.addComponent(component.Type, component)
        Registry.attachComponent(this.Id, component)

        component.Parent = this

        this.#components[component.Type] = component.Id        
        this.#scene.OnEntity(this)

        return this
    }

    GetComponent(typeId: TypeId): Component | undefined
    GetComponent<T extends Component>(type: Class<T>): T | undefined
    GetComponent<T extends Component>(type: TypeId | Class<T>): T | undefined
    {
        const typeId = typeof type === 'number'
            ? type
            : Registry.getComponentTypeId(type)!

        return Registry.getComponent(typeId, this.#components[typeId]!)
    }

    HasComponent(typeId: TypeId): boolean
    HasComponent<T extends Component>(type: Class<T>): boolean
    HasComponent<T extends Component>(type: TypeId | Class<T>): boolean
    {
        const typeId = typeof type === 'number'
            ? type
            : Registry.getComponentTypeId(type)!

        return this.#components[typeId] !== undefined
    }
    
    RemoveComponent(typeId: TypeId): Entity
    RemoveComponent<T extends Component>(type: Class<T>): Entity
    RemoveComponent<T extends Component>(type: TypeId | Class<T>): Entity
    {
        const typeId = typeof type === 'number'
            ? type
            : Registry.getComponentTypeId(type)!

        const component = this.GetComponent(typeId)
        
        
        if (component)
        {
            Registry.detachComponent(this.Id, component)
            this.#components[component.Type] = undefined
            component.Parent = undefined
        }

        this.#scene.OnEntity(this)
        
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
