import { Component, Entity, System } from "@fwge/core"

export type ISerializer<T> = <T>(item: T) => string
export type IComponentSerializer<T extends Component> = ISerializer<T>
export type ISystemSerializer<T extends System> = ISerializer<T>
export type IEntitySerializer<T extends Entity> = ISerializer<T>

export type IDeserializer<T> = <T>(string: string) => T
export type IComponentDeserializer<T extends Component> = IDeserializer<T>
export type ISystemDeserializer<T extends System> = IDeserializer<T>
export type IEntityDeserializer<T extends Entity> = IDeserializer<T>