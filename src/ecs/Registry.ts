import { Scene } from 'core/Scene'
import { Component } from './Component'
import { Entity } from './Entity'

export type TypeId = number
export type SystemId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type PrefabId = number
export type RegistryId = `${SceneId}-${EntityId}-${TypeId}`
export type Head<T extends unknown[]> = T[0]
export type Tail<T extends unknown[]> = T extends [Head<T>, ...infer TailType] ? TailType : never

export type Class<T> = 
{
    new (...args: any[]): T
}

export type Constructor<T, U extends any[]> = 
{
    new (...args: U): T
}

export type z = Head<[number, boolean, string]>
export type a = Tail<[number, boolean, string]>

export interface IConstruct<T extends new (...args: any) => any>
{
    type: new (...args: ConstructorParameters<T>) => InstanceType<T>
}

export const components: Map<Class<Component>, Component[]> = new Map()

export class Registry
{
    private static entityId: EntityId = 0
    private static componentId: TypeId = 1
    private static readonly components: Map<RegistryId, Component> = new Map()
    private static readonly componentIds: Map<Class<Component>, TypeId> = new Map()


    //#region Entity
    static setEntityComponent<T extends Component>(scene: Scene, entity: Entity, component: T)
    {
        const registryId: RegistryId = `${scene.Id}-${entity.Id}-${component.TypeId}`
        this.components.set(registryId, component)
    }
    
    static getEntityComponent<T extends Component>(scene: Scene | SceneId, entity: Entity | EntityId, componentType: Class<T> | TypeId): T | undefined
    {
        const registryId: RegistryId = `${typeof scene === 'number' ? scene: scene.Id}-${typeof entity === 'number' ? entity: entity.Id}-${typeof componentType === 'number' ? componentType : this.getComponentType(componentType)}`
        return this.components.get(registryId) as T
    }

    static removeEntityComponent<T extends Component>(scene: Scene | SceneId, entity: Entity | EntityId, componentType: Class<T> | TypeId): T | undefined
    {
        const registryId: RegistryId = `${typeof scene === 'number' ? scene: scene.Id}-${typeof entity === 'number' ? entity: entity.Id}-${typeof componentType === 'number' ? componentType : this.getComponentType(componentType)}`
        const component = this.components.get(registryId) as T
        this.components.delete(registryId)
        return component
    }
    //#endregion


    //#region Ids
    static createEntity()
    {
        return this.entityId++
    }

    static registerComponentType<T extends Component>(componentType: Class<T>): void
    {
        if (this.componentIds.has(componentType))
            return
         
            
        this.componentIds.set(componentType, this.componentId)
        this.componentId = this.componentId << 1
    }

    static getComponentType<T extends Component>(componentType: Class<T>): TypeId
    {
        if (!this.componentIds.has(componentType))
            throw 'oops'
            
        return this.componentIds.get(componentType)!
    }
    //#endregion
}
