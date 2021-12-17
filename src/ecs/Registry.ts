import { Component } from './Component'
import { System } from './System'

export type TypeId = number
export type SystemId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type PrefabId = number

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

// export type ComponentConstruct = IConstruct<Component>

export const components: Map<Class<Component>, Component[]> = new Map()

export class Registry
{
    //#region Scene
    public static componentTypeId: Map<SceneId, Map<string, TypeId>> = new Map()
    public static registerComponentType(sceneId: SceneId, name: any): TypeId | -1
    {
        const types = this.componentTypeId.get(sceneId) ?? new Map()
        
        types.set(name, types.size)
        this.componentTypeId.set(sceneId, types)

        return types.get(name) ?? -1
    }

    public static getComponentType(sceneId: SceneId, name: any): TypeId | -1
    {
        const types = this.componentTypeId.get(sceneId) ?? new Map()
        return types.get(name) ?? -1
    }
    
    public static systemTypeId: Map<SceneId, Map<string, SystemId>> = new Map()
    public static registerSystemType(sceneId: SceneId, name: any): SystemId | -1
    {
        const types = this.systemTypeId.get(sceneId) ?? new Map()
        
        types.set(name, types.size)
        this.componentTypeId.set(sceneId, types)

        return types.get(name) ?? -1
    }

    public static getSystemType(sceneId: SceneId, name: any): SystemId | -1
    {
        const types = this.systemTypeId.get(sceneId) ?? new Map()
        return types.get(name) ?? -1
    }
    //#endregion

    private static readonly entities: ComponentId[][] = []
    private static readonly systems: System[] = []

    public static createEntity(): EntityId
    {
        const entityId = Registry.entities.length
        this.entities.push([])

        return entityId
    }

    public static readonly entityList: Map<EntityId, Map<TypeId, ComponentId>> = new Map()
    public static readonly component: Map<ComponentId, Component>[] = []
    public static readonly componentType: Map<Class<Component>, TypeId> = new Map()
    public static readonly componentId: Map<Class<Component>, ComponentId> = new Map()

    public static getNextComponentId<T extends Component>(type: Class<T>): TypeId
    {
        const id = Registry.componentId.get(type) ?? 0
        Registry.componentId.set(type, id + 1)
        return id
    }

    public static getComponentTypeId<T extends Component>(type: Class<T>): TypeId
    {
        return Registry.componentType.get(type) ?? -1
    }

    public static setComponentTypeId<T extends Component>(type: Class<T>): void
    {
        if (!Registry.componentType.has(type))
        {
            Registry.componentType.set(type, Registry.componentType.size)
            this.component[Registry.componentType.get(type)!] = new Map()
        }
    }

    public static addComponent<T extends Component>(typeId: TypeId, component: T): void
    {
        this.component[typeId].set(component.Id, component)
    }

    public static getComponent<T extends Component>(typeId: TypeId, componentId: ComponentId): T | undefined
    {
        return this.component[typeId].get(componentId) as T
    }

    public static attachComponent<T extends Component>(entityId: EntityId, component: T): void
    {
        const ent = this.entityList.get(entityId) ?? new Map()
        ent.set(component.Type, component.Id)
        this.entityList.set(entityId, ent)
    }

    public static detachComponent<T extends Component>(entityId: EntityId, component: T): void
    {
        const ent = this.entityList.get(entityId) ?? new Map()
        ent.delete(component.Type)
        this.entityList.set(entityId, ent)
    }
}
