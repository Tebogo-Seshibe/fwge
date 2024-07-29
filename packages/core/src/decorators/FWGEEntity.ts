import { Constructor, Entity } from "@fwge/ecs";
import { ComponentMetadata, componentTag } from "./utils";
import { DecoratorManager } from "./DecoratorManager";

export function FWGEEntity<T extends Entity>(): <TConstructor extends new (...args: any[]) => T>(constructor: TConstructor) => TConstructor | void
{
    return function<TConstructor extends new (...args: any[]) => T>(base: TConstructor): TConstructor | void
    {
        DecoratorManager.Entities.push({ name: base.name, class: base as any as Constructor<Entity>, config: [] });

        return new Proxy(base,
        {
            construct(constructor, argArray, _2)
            {
                const entity = new constructor(...argArray);
                const components = Reflect.getMetadata(componentTag, constructor) as Map<string, ComponentMetadata> ?? new Map();
                
                for (const [ , { propertyKey, component } ] of components.entries())
                {
                    const comp = component()
                    entity.AddComponent(comp);
                    Reflect.defineProperty(entity, propertyKey, {
                        value: comp
                    });
                }

                Reflect.deleteMetadata(componentTag, constructor);
                return entity;
            },
        });
    }
}
