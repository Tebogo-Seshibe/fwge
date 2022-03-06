import { Component } from './Component'

export type TypeId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type PrefabId = number
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

export interface IConstruct<T extends new (...args: any) => any>
{
    type: new (...args: ConstructorParameters<T>) => InstanceType<T>
}

export const GetComponentId = Symbol.for('GetComponentId')
export const SetComponentId = Symbol.for('SetComponentId')

export class Registry
{
    #entityId: EntityId = 0
    #componentId: TypeId = 0
    #componentIds: Map<Class<Component>, TypeId> = new Map()
    #components: Map<Class<Component>, Component[]> = new Map()

    //#region Ids
    createEntity(): EntityId
    {
        return this.#entityId++
    }

    createComponent<T extends Component>(component: T): ComponentId
    {
        const componentId = this.#components.get(component.Type)!.length
        this.#components.get(component.Type)![componentId] = component
        component.Id = componentId

        return componentId
    }

    getComponent<T extends Component>(componentType: Class<T>, componentId?: ComponentId): T | undefined
    {
        return !Number.isNaN(componentId)
            ? this.#components.get(componentType)![componentId!] as T
            : undefined
    }

    removeComponent()
    {
        
    }

    registerComponentType<T extends Component>(componentType: Class<T>): void
    {
        if (this.#componentIds.has(componentType))
            return        
            
        this.#componentIds.set(componentType, this.#componentId)
        this.#componentId = this.#componentId + 1
        this.#components.set(componentType, [])
    }

    getComponentType<T extends Component>(componentType: Class<T>): TypeId
    {
        if (!this.#componentIds.has(componentType))
        {
            throw new Error(`Component type ${componentType} not registered`)
        }
            
        return this.#componentIds.get(componentType)!
    }
    //#endregion
}
