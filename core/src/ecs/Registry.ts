import { Component } from './Component'
import { System } from './System'

export type TypeId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type PrefabId = number
export type Head<T extends unknown[]> = T[0]
export type Tail<T extends unknown[]> = T extends [Head<T>, ...infer TailType] ? TailType : never

export type Class<T> = 
{
    _typeIndex?: TypeId
    new (...args: any[]): T
}

export type Constructor<T, U extends any[]> = 
{
    _typeIndex?: TypeId
    new (...args: U): T
}

export interface IConstruct<T extends new (...args: any) => any>
{
    type: new (...args: ConstructorParameters<T>) => InstanceType<T>
}

export class Registry
{
    private _entityId: EntityId = 0
    private _componentId: TypeId = 0
    private _components: Component[][] = []
    private _systemId: TypeId = 0
    private systems: System[][] = []

    //#region Ids
    createEntity(): EntityId
    {
        return this._entityId++
    }

    createComponent<T extends Component>(component: T): ComponentId
    {
        const componentList = this._components[component.Type._typeIndex!]

        component.Id = componentList.length
        componentList.push(component)

        return component.Id
    }

    getComponent<T extends Component>(componentTypeId: TypeId, componentId?: ComponentId): T | undefined
    {
        return !Number.isNaN(componentId)
            ? this._components[componentTypeId][componentId!] as T
            : undefined
    }

    removeComponent<T extends Component>(component: T): void
    removeComponent<T extends Component>(componentType: Class<T>, componentId: ComponentId): void
    removeComponent<T extends Component>(arg: T | Class<T>, componentId?: ComponentId): void
    {
        
    }

    registerComponentType<T extends Component>(componentType: Class<T>): void
    {
        if (componentType._typeIndex !== undefined)
            return        
            
        componentType._typeIndex = this._componentId
        this._componentId = this._componentId + 1

        this._components[componentType._typeIndex] = []
    }

    registerSystemType<T extends System>(systemType: Class<T>): void
    {
        if (systemType._typeIndex !== undefined)
            return        
            
        systemType._typeIndex = this._systemId
        this._systemId = this._systemId + 1

        this.systems[systemType._typeIndex] = []
    }
    //#endregion
}
