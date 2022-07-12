import { Component } from "./Component"

export type TypeId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type AssetId = number
export type PrefabId = number
export type Head<T extends unknown[]> = T[0]
export type Tail<T extends unknown[]> = T extends [Head<T>, ...infer TailType] ? TailType : never

export class RegistryType
{
    readonly Id: number
    readonly Type: Class<any>
    readonly TypeId: number

    constructor(type?: Class<any>)
    {
        type = type ?? new.target as Class<any>

        this.Id = nextId(type),
        this.Type = type
        this.TypeId = getTypeId(type)
    }
}

export function createComponent(typeId: number, entityId: number, component: Component): void
{
    if (!Components.has(typeId))
    {
        Components.set(typeId, new Map())
    }

    Components.get(typeId)!.set(entityId, component)
}

export function getComponent<T extends Component>(type: Class<T>, entityId: number): T
{
    const typeId = getTypeId(type)
    return Components.get(typeId)!.get(entityId)! as T
}

export interface TypeAndId
{
    _typeId?: TypeId
    _elementId?: number
}

export type Class<T = {}> = 
{
    new (...args: any[]): T
    prototype: Partial<T>
} & TypeAndId

export type Constructor<T, U extends ConstructorParameters<Class<T>>> =
{
    new (...args: U): T
    prototype: Partial<T>
} & TypeAndId


export interface ConstructorArgs<T, K extends any[] = [], U = Constructor<T, K>>
{
    Constructor: U
    args?: K
}

export const nextId = <T>(_class: Class<T>): EntityId => 
{
    const id = IDGen.get(_class) ?? 0
    IDGen.set(_class, id + 1)

    return id
}

export const getTypeId = <T>(_class: Class<T>): TypeId =>
{
    let id = TypeIDs.get(_class)

    if (id === undefined)
    {
        id = TypeIDs.size
        TypeIDs.set(_class, id)
    }

    return id
}

const IDGen: Map<Class<any>, number> = new Map()
const TypeIDs: Map<Class<any>, number> = new Map()
export const Components: Map<number, Map<number, Component>> = new Map()

// export const nextTypeId = <T>
export interface IConstruct<T extends new (...args: any) => any>
{
    type: new (...args: ConstructorParameters<T>) => InstanceType<T>
}
