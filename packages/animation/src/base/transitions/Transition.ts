import { Entity } from "@fwge/core"

export type ValueGetter<T> = (entity: Entity) => T
export type Transition<T> = (t: number, curr: T, next:T, out: T) => void
