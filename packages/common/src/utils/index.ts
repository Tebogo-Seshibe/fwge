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

export function instanceOf<T>(object: any, ...keys: (keyof T & string)[]): object is T
{
    const validKeys = Object.getOwnPropertyNames(object);

    for (let i = 0; i < keys.length; ++i)
    {
        if (!validKeys.includes(keys[i]))
        {
            return false;
        }
    }

    return true;
}