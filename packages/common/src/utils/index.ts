export * from './ArrayUtils'
export * from './Decorators'
export * from './Delay'
export * from './Equation'
export * from './ErrorUtils'
export * from './GL'
export * from './ImageUtils'
export * from './interfaces'
export * from './LinkedList'
export * from './Math'
export * from './Model'

export function instanceOf<T>(object: any, ...keys: (keyof T)[]): object is T
{
    return keys.reduce((curr, key) => curr && key in object, true)
}