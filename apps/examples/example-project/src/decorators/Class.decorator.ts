import type { Component, Entity } from "@fwge/ecs";

export const classComponent = 'fwge:component' as const;
export type ComponentMetadata = { propertyKey: string | symbol, component: () => Component };

export function EditorEntity<EntityType extends Entity>(): ClassDecorator
{
    return function<Constructor extends Function>(base: Constructor): Constructor | void
    {
        const constructor = base as unknown as (new (...args: unknown[]) => EntityType);
        return new Proxy(base, {
            construct(_o, argArray, _n) {
                const entity = new constructor(...argArray);
                const components = Reflect.getMetadata(classComponent, constructor) as Map<string, ComponentMetadata>;
                
                for (const [ , { propertyKey, component } ] of components.entries())
                {
                    const comp = component()
                    entity.AddComponent(comp);
                    Reflect.defineProperty(entity, propertyKey, {
                        value: comp
                    });
                }

                Reflect.deleteMetadata(classComponent, constructor);
                return entity;
            },
        });
    }
}