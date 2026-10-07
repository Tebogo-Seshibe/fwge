import { Component, Constructor } from "@fwge/ecs";
import { DecoratorManager } from "./DecoratorManager";
import { ComponentMetadata, componentTag } from "./utils";

export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;

export function FWGEComponent<T extends ComponentConstructor>(type: T): PropertyDecorator
export function FWGEComponent<T extends ComponentConstructor>(type: T, ...args: ConstructorParameters<T>): PropertyDecorator
export function FWGEComponent<T extends ComponentConstructor>(type: T, ...args: ConstructorParameters<T>): PropertyDecorator
{
    return function(target: any, propertyKey: string | symbol): void
    {
        DecoratorManager.Components.push({name: target.constructor.name, class: target.constructor as any as Constructor<Component>, config: args})

        const components: Map<string, ComponentMetadata> = Reflect.getMetadata(componentTag, target.constructor) ?? new Map();
        if (!components.has(type.name))
        {
            components.set(type.name, { propertyKey, component: () => new type(...args) });
        }
        Reflect.defineMetadata(componentTag, components, target.constructor);
    }
}
