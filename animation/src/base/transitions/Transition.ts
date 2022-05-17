import { Entity } from "@fwge/core"

export type ValueGetter<T> = (this: Entity) => T
export type Transition<T> = (t: number, curr: T, next:T, out: T) => void