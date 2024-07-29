import { Component } from '@fwge/ecs';
import 'reflect-metadata'
export type MetadataKey = 'design:type' | 'design:paramtypes' | 'design:returntypes'
export type Metadata = {
    ['design:type']: Function | undefined
    ['design:paramtypes']: Function[] | undefined
    ['design:returntypes']: Function[] | undefined
}

export const componentTag = 'fwge:component' as const;
export const entityTag = 'fwge:entity' as const;
export const assetTag = 'fwge:asset' as const;
export const systemTag = 'fwge:system' as const;
export const sceneTag = 'fwge:scene' as const;
export const gameTag = 'fwge:game' as const;

export type ComponentMetadata = { 
    propertyKey: string | symbol, 
    component: () => Component
};

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
