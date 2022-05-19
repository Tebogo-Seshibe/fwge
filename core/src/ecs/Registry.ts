export type TypeId = number
export type SceneId = number
export type EntityId = number
export type ComponentId = number
export type PrefabId = number
export type Head<T extends unknown[]> = T[0]
export type Tail<T extends unknown[]> = T extends [Head<T>, ...infer TailType] ? TailType : never

export interface TypeAndId
{
    _typeId?: TypeId
    _elementId?: number
}

export type Class<T> = 
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
    if (!_class._elementId)
    {
        _class._elementId = 0
    }

    return _class._elementId++
}

export interface IConstruct<T extends new (...args: any) => any>
{
    type: new (...args: ConstructorParameters<T>) => InstanceType<T>
}