import { Component, Entity, System } from "@fwge/ecs"

export type ISerializer<T> = (item: T) => string
export type IComponentSerializer<T extends Component> = ISerializer<T>
export type ISystemSerializer<T extends System> = ISerializer<T>
export type IEntitySerializer<T extends Entity> = ISerializer<T>

export type IDeserializer<T> = (string: string) => T
export type IComponentDeserializer<T extends Component> = IDeserializer<T>
export type ISystemDeserializer<T extends System> = IDeserializer<T>
export type IEntityDeserializer<T extends Entity> = IDeserializer<T>
