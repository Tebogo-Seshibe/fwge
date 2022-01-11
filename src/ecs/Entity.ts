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

    readonly Id: EntityId
    
    get Parent(): Entity | undefined
    {
        return this.#parent !== undefined
            ? this.#scene.GetEntity(this.#parent)
            : undefined
    }

    constructor(scene: Scene)
    {
        this.#scene = scene
        this.Id = Registry.createEntity()
    }

    //#region Component
    AddComponent<T extends Component>(component: T): Entity
    {
        Registry.addComponent(component.Type, component)
        Registry.attachComponent(this.Id, component)

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

    GetComponents(): Component[]
    {
        const components: Component[] = []

        for (let typeId = 0; typeId < this.#components.length; ++typeId)
        {
            const componentId = this.#components[typeId]
            if (!Number.isNaN(componentId))
            {
                components.push(Registry.getComponent(typeId, componentId!)!)
            }
        }

        return components
    }

    HasComponent<T extends Component>(type: Class<T>): boolean
    {
        return Boolean(this.#components[Registry.getComponentTypeId(type)])
    }
    
    RemoveComponent<T extends Component>(type: Class<T>): Entity
    {
        const component = this.GetComponent(type)

        if (component)
        {
            Registry.detachComponent(this.Id, component)
            this.#components[component.Type] = undefined
        }

        this.#scene.OnEntity(this)
        
        return this
    }
    //#endregion

    //#region Children Entity
    SetParent(entity?: Entity): void
    {
        this.#parent = entity?.Id
        console.log(entity)
    }

    AddChild(entity: Entity): Entity
    AddChild(entity: EntityId): Entity
    AddChild(arg: EntityId | Entity): Entity
    {
        const entity = typeof arg === 'number'
            ? this.#scene.GetEntity(arg)!
            : arg

        if (this.Id !== entity.Id && !this.#children.includes(entity.Id))
        {
            this.#children.push(entity.Id)
            entity.SetParent(this)
        }

        return this
    }

    GetChildren(): Entity[]
    {
        return this.#children.map((_, index) => this.GetChild(index))
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
            entity.SetParent(this)
        }

        return this
    }
    //#endregion
}
