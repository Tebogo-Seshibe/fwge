import { ComponentMetadata, componentTag, DecoratorManager } from "@fwge/core";
import { Component, Constructor } from "@fwge/ecs";

export {};

export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;

export function OrderComponent<T extends ComponentConstructor>(type: T): PropertyDecorator
export function OrderComponent<T extends ComponentConstructor>(type: T, ...args: ConstructorParameters<T>): PropertyDecorator
export function OrderComponent<T extends ComponentConstructor>(type: T, ...args: ConstructorParameters<T>): PropertyDecorator
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

export interface WheelArgs {
    count: number;
    diameter: number;
    brand: string;
}
export class Wheel extends Component {
    readonly description: string;

    constructor()
    constructor(args: WheelArgs)
    constructor(args: WheelArgs = {count: 1, brand: 'N/A', diameter: 1}) {
        super();
        this.description = `${args.count} ${args.diameter} from ${args.brand}`
    }
}

export interface SeatArgs {
    height: number;
    maxWeight: number;
    brand: string;
}
export class Seat extends Component {
    readonly description: string;

    constructor()
    constructor(args: SeatArgs)
    constructor(args: SeatArgs = {height: 1, brand: 'N/A', maxWeight: 1}) {
        super();
        this.description = `${args.height}cm holding up to ${args.maxWeight}kg from ${args.brand}`
    }

}

// export class Order {
//     @OrderComponent(Seat)
//     seat!: Seat;

//     @OrderComponent(Wheel, {count: 4, brand: 'Pirelli', diameter: 32})
//     wheel!: Wheel;
// }
