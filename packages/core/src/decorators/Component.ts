import 'reflect-metadata'
import { Component, Entity, Class, SharedComponent } from "../ecs"
import { GetMetadata } from './utils'

export function AsComponent<K extends Component | string>(): PropertyDecorator
export function AsComponent<K extends Component | string>(): PropertyDecorator
export function AsComponent<K extends Component | string>(name: string): PropertyDecorator
export function AsComponent<K extends Component | string>(arg?: string): PropertyDecorator
{
    return function <T extends Entity, U extends T | Object>(target: U, propertyKey: string | symbol): void
    {
        let component: K | undefined = undefined
        const metadata = GetMetadata(target, propertyKey)
        const ComponentType = metadata['design:type']! as Class<any>
        const entity = (target as T)

        entity.OnCreate = function()
        {
            component = (target as any)[propertyKey]

            Reflect.deleteProperty(entity, propertyKey)
            Reflect.defineProperty(entity, propertyKey,
            {
                get: () => component,
                set: (_component) =>
                {
                    component = (typeof component === 'string')
                        ? entity
                            ?.Scene
                            ?.Game
                            ?.GetComponent(
                            _component,
                            ComponentType as any as Class<SharedComponent>,
                        ) as K | undefined
                        : _component

                    entity.RemoveComponent(ComponentType)
                    if (component)
                    {
                        entity.AddComponent(_component)
                    }
                },
                enumerable: true,
                configurable: true
            })
        }
    }
}
