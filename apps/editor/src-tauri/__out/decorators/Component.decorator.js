import { classComponent } from "./Class.decorator";
export function EditorComponent(type, ...args) {
    return function (target, propertyKey) {
        const components = Reflect.getMetadata(classComponent, target.constructor) ?? new Map();
        if (!components.has(type.name)) {
            components.set(type.name, { propertyKey, component: () => new type(...args) });
        }
        Reflect.defineMetadata(classComponent, components, target.constructor);
    };
}
