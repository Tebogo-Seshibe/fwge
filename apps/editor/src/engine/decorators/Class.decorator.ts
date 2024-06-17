import type { Component, Entity } from "@fwge/ecs";
import "reflect-metadata";

export const classComponent = 'fwge:component' as const;
export type ComponentMetadata = { propertyKey: string | symbol, component: Component };

export function EditorEntity<EntityType extends Entity>(): ClassDecorator
{
    return function<Constructor extends Function>(base: Constructor): Constructor
    {
        let constructor = base as any as (new (...args: any[]) => EntityType);
        return new Proxy(base, {
            construct(_, argArray) {
                const entity = new constructor(...argArray);
                const components = Reflect.getMetadata(classComponent, constructor) as Map<string, ComponentMetadata>;
                
                for (const [ _, { propertyKey, component } ] of components.entries())
                {
                    entity.AddComponent(component);
                    (entity as any)[propertyKey] = component;
                }

                Reflect.deleteMetadata(classComponent, constructor);
                return entity;
            },
        });
    }
}