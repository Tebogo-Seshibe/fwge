import type { Component } from "@fwge/ecs";
import { classComponent, type ComponentMetadata } from "./Class.decorator";

export function EditorComponent<T extends new (...args: any[]) => Component>(type: T, ...args: ConstructorParameters<T>): PropertyDecorator
{
    return function(target: Object, propertyKey: string | symbol): void
    {
        const components: Map<string, ComponentMetadata> = Reflect.getMetadata(classComponent, target.constructor) ?? new Map();
        if (!components.has(type.name))
        {
            components.set(type.name, { propertyKey, component: () => new type(...args) });
        }
        Reflect.defineMetadata(classComponent, components, target.constructor);
    }
}
