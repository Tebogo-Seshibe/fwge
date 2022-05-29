export type Only<
    T,
    K extends (keyof T)[],
    V extends (keyof T)[] = []
> = K['length'] extends V['length']
    ? { }
    : { [key in K[V['length']]]: string } 
        & Only<
            T,
            K,
            [K[V['length']], ...V]
        >

export type Serialized<T> = { [Key in keyof T]: string }
export type Serializer<T> = (target: T) => Serialized<T>
export type Serializable<T> = { __serialize: Serializer<T> }

export const getDefaultSerializer = <T>(keys?: (keyof T)[]) => (target: any) =>
{
    const serialized: Serialized<any> = { }
    keys = keys ?? Object.keys(target) as (keyof T)[]

    return keys.reduce((obj, key) =>
    {
        obj[key] = `${ target[key] }`
        return obj
    }, serialized)
}

export function IsSerializable<T>(): ClassDecorator
export function IsSerializable<T>(...keys: (keyof T)[]): ClassDecorator
export function IsSerializable<T>(serializer: Serializer<T>): ClassDecorator
export function IsSerializable<T>(arg?: Serializer<T> | keyof T, ...keys: (keyof T)[] ): ClassDecorator
{
    if (arg === undefined)
    {
        arg = getDefaultSerializer()
    }
    else if (typeof arg === 'string')
    {
        arg = getDefaultSerializer([arg, ...keys] as string[])
    }

    const serializer = arg as Serializer<T>

    return function (target)
    {
        (<unknown>target as Serializable<T>).__serialize = serializer
    }
}
