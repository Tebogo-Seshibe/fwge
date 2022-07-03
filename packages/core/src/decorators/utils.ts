import 'reflect-metadata'
export type MetadataKey = 'design:type' | 'design:paramtypes' | 'design:returntypes'
export type Metadata = {
    ['design:type']: Function | undefined
    ['design:paramtypes']: Function[] | undefined
    ['design:returntypes']: Function[] | undefined
}

export const GetMetadata = function (target: Object, propertyKey?: string | symbol): Metadata
{
    return propertyKey 
        ? Reflect.getMetadataKeys(target, propertyKey)
            .reduce((curr: Metadata, key: MetadataKey) => (
            {
                ...curr,
                [key]: Reflect.getMetadata(key, target, propertyKey)
            }), { })
        : Reflect.getMetadataKeys(target)
            .reduce((curr: Metadata, key: MetadataKey) => (
            {
                ...curr,
                [key]: Reflect.getMetadata(key, target)
            }), { })
}
