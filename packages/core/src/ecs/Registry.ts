import { Component } from "./Component"

export type TypeId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type AssetId = number
export type PrefabId = number
export type Head<T extends unknown[]> = T[0]
export type Tail<T extends unknown[]> = T extends [Head<T>, ...infer TailType] ? TailType : never
export type TupleFromIndex<T extends unknown[], Index extends number = 0, Counter extends unknown[] = []> = 
    Counter['length'] extends Index
    ? T
    : TupleFromIndex<Tail<T>, Index, [...Counter, Head<T>]>

export type TypeAtIndex<T extends any[], Index extends number> = T[Index]

export type Tuple<ChildTypes extends unknown[], IdentifiedTypes extends unknown[] = []> = 
    ChildTypes['length'] extends 0
    ? IdentifiedTypes
    : Tuple<TupleFromIndex<ChildTypes, IdentifiedTypes['length']>, [Head<ChildTypes>, ...IdentifiedTypes]>


export type Class<T = {}> = 
{
    new (...args: any[]): T
    prototype: Partial<T>
}

export type Constructor<T, U extends ConstructorParameters<Class<T>>> =
{
    new (...args: U): T
    prototype: Partial<T>
}
    
export const typeIdToType = new Map<number, Class<any>>()

export class RegistryType
{
    readonly Id: number
    readonly TypeId: number

    get Type(): Class<any>
    {
        return typeIdToType.get(this.TypeId)!
    }

    constructor(type?: Class<any>)
    {
        type = type ?? new.target as Class<any>

        this.TypeId = getTypeId(type)
        this.Id = nextId(type)
    }
}

export function createEntity(): EntityId
{
    let entityId: number = EntityMap.findIndex(x => !x)
    if (entityId === -1)
    {
        entityId = EntityMap.length
        EntityMap.push(true)
    }
    return entityId
}

export function deleteEntity(entityId: EntityId): void
{
    EntityMap[entityId] = false

    for (let i = 0; i < ComponentArray.length; ++i)
    {
        ComponentArray[0][entityId] = undefined
    }
}

export function createComponent(component: Component): void
{
    ComponentsArray[Math.log2(component.TypeId)][component.Id] = component
}

export function addComponent(entityId: EntityId, component: Component): void
{
    const componentIndex = Math.log2(component.TypeId)
    ComponentArray[componentIndex][entityId] = component
}

export function removeComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): T | undefined
export function removeComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): T | undefined
export function removeComponent<T extends Component>(entityId: EntityId, componentTypeAndId: Class<T> | TypeId): T | undefined
{
    const componentIndex = Math.log2(typeof componentTypeAndId === 'number' ? componentTypeAndId : getTypeId(componentTypeAndId))
    const component = ComponentArray[componentIndex][entityId]
    ComponentArray[componentIndex][entityId] = undefined
    return component as T
}

export function getAComponent<T extends Component>(typeId: TypeId, entityId: EntityId): T
export function getAComponent<T extends Component>(typeId: Class<T>, entityId: EntityId): T
export function getAComponent<T extends Component>(type: TypeId | Class<T>, entityId: EntityId): T
{
    const typeIndex = Math.log2(typeof type === 'number' ? type : getTypeId(type))
    return ComponentArray[typeIndex][entityId] as T
}

export function hasComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): boolean
export function hasComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): boolean
export function hasComponent<T extends Component>(entityId: EntityId, componentTypeAndId: Class<T> | TypeId): boolean
{
    const componentIndex = Math.log2(typeof componentTypeAndId === 'number' ? componentTypeAndId : getTypeId(componentTypeAndId))
    return ComponentArray[componentIndex][entityId] !== undefined
}

export function getComponentById<T extends Component>(componentType: Class<T>, componentId: EntityId): T | undefined
export function getComponentById<T extends Component>(componentTypeId: TypeId, componentId: EntityId): T | undefined
export function getComponentById<T extends Component>(componentTypeAndId: Class<T> | TypeId, componentId: EntityId): T | undefined
{
    const componentIndex = Math.log2(typeof componentTypeAndId === 'number' ? componentTypeAndId : getTypeId(componentTypeAndId))
    return ComponentsArray[componentIndex][componentId] as T
}

export function getComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): T | undefined
export function getComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): T | undefined
export function getComponent<T extends Component>(entityId: EntityId, componentTypeAndId: Class<T> | TypeId): T | undefined
{
    const componentIndex = Math.log2(typeof componentTypeAndId === 'number' ? componentTypeAndId : getTypeId(componentTypeAndId))
    return ComponentArray[componentIndex][entityId] as T
}

export function getAllComponents(entityId: EntityId): Component[]
export function getAllComponents(entityId: EntityId): Component[]
export function getAllComponents(entityId: EntityId): Component[]
{
    const components: Component[] = []
    
    for (let i = 0; i < ComponentArray.length; ++i)
    {
        const component = ComponentArray[i][entityId]
        if (component)
        {
            components.push(component)
        }
    }

    return components
}

function nextId<T>(_class: Class<T>): EntityId
{
    const typeIndex = Math.log2(TypeIDs.get(_class)!)
    const componentId = ComponentsArray[typeIndex].length
    ComponentsArray[typeIndex].push(undefined)
    return componentId
}

export function getTypeId<T>(_class: Class<T>): TypeId
{
    let componentTypeId = TypeIDs.get(_class)

    if (componentTypeId === undefined)
    {
        componentTypeId = typeId
        typeId = typeId << 1
        TypeIDs.set(_class, componentTypeId)
        typeIdToType.set(componentTypeId, _class)
        ComponentArray.push([])
        ComponentsArray.push([])
    }

    return componentTypeId
}

export type ViewFilter<T extends Component[] = Component[]> = 
{
    name: string
    exec: (...args: T) => boolean
}

const CustomView: Map<string, number[]> = new Map()

export function view<T1 extends Component>(
    types: [Class<T1>],
    filter?: ViewFilter<[T1]>
): EntityId[]
export function view<T1 extends Component>(
    types: [Class<T1>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component>(
    types: [Class<T1>, Class<T2>],
    filter?: ViewFilter<[T1, T2]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component>(
    types: [Class<T1>, Class<T2>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>],
    filter?: ViewFilter<[T1, T2, T3]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>],
    name: ViewFilter<[T1, T2, T3, T4]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>],
    name: ViewFilter<[T1, T2, T3, T4, T5]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>],
    name: ViewFilter<[T1, T2, T3, T4, T5, T6]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>],
    name: ViewFilter<[T1, T2, T3, T4, T5, T6, T7]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component, T8 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>, Class<T8>],
    name: ViewFilter<[T1, T2, T3, T4, T5, T6, T7, T8]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component, T8 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>, Class<T8>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component, T8 extends Component, T9 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>, Class<T8>, Class<T9>],
    name: ViewFilter<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component, T8 extends Component, T9 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>, Class<T8>, Class<T9>],
    name: string
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component, T8 extends Component, T9 extends Component, T10 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>, Class<T8>, Class<T9>, Class<T10>],
    name: ViewFilter<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
): EntityId[]
export function view<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component, T5 extends Component, T6 extends Component, T7 extends Component, T8 extends Component, T9 extends Component, T10 extends Component>(
    types: [Class<T1>, Class<T2>, Class<T3>, Class<T4>, Class<T5>, Class<T6>, Class<T7>, Class<T8>, Class<T9>, Class<T10>],
    name: string
): EntityId[]
export function view(
    types: Class<Component>[],
    filter: ViewFilter | string = ''
): EntityId[]
{
    const viewId = types.map(getTypeId).reduce((prev, curr) => prev + curr, 0)
    const viewIndexes = types.map(getTypeId).map(Math.log2)
    const filterName = typeof filter === 'string' ? filter : filter?.name ?? ''
    const viewName = viewId + filterName
    let viewResults: EntityId[] = []

    if (CustomView.has(viewName))
    {
        viewResults = CustomView.get(viewName)!
    }
    else
    {
        for (let entityId = 0; entityId < EntityMap.length; ++entityId)
        {
            const components = viewIndexes.map((componentTypeId) => ComponentArray[componentTypeId][entityId])
            let valid = !components.any(component => component === undefined)

            if (!valid)
            {
                continue
            }

            if (typeof filter === 'string' || filter.exec(...(components as Component[])))
            {
                viewResults.push(entityId)
            }
        }

        CustomView.set(viewName, viewResults)
    }

    return viewResults
}



let typeId = 1
const TypeIDs: Map<Class<any>, number> = new Map()
const EntityMap: boolean[] = []
const ComponentArray: (Component | undefined)[][] = []
const ComponentsArray: (Component | undefined)[][] = []
