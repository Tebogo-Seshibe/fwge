import { Material, MeshRenderer, Transform } from "@fwge/core";
import type { Class, Component, Constructor, Type } from "@fwge/ecs";

export type WindowName = 'launcher' | 'editor';

export type ConstructorArgs<T extends Component> =
    Class<T> extends { new (...args: infer U): T }
    ? U
    : never


var transform_args: ConstructorArgs<Transform>

export function CreateComponent<T extends Component, Args = Constructor<T>>(componentType: Class<T>, ...args: ConstructorArgs<T>): T {
    return new componentType(...args);
}

const transform = CreateComponent(Transform, );
const renderer = CreateComponent(MeshRenderer);
const material = CreateComponent(Material);