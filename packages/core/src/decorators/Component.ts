import 'reflect-metadata'
import { GetMetadata } from './utils'
import { Class, Component, Entity, Registry } from '@fwge/ecs'

export function AsComponent<K extends Component>(): PropertyDecorator
{
    return function <T extends Entity, U extends T | Object>(target: U, propertyKey: string | symbol): void
    {
        let component: K | undefined = undefined;
        const metadata = GetMetadata(target, propertyKey);
        const ComponentType = metadata['design:type']! as Class<K>;
        const entity = (target as T);
        
        Reflect.deleteProperty(entity, propertyKey)
        Reflect.defineProperty(entity, propertyKey,
        {
            get: (): K | undefined => component,
            set: (_component: K | undefined) =>
            {
                if (_component)
                {
                    Registry.AddComponent(entity.Id, _component);
                }
                else
                {
                    Registry.RemoveComponent(entity.Id, ComponentType.TypeId);
                }
            },
            enumerable: true,
            configurable: false
        });
    }
}
