import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { Entity, EntityId } from "@fwge/ecs"
import { Collider } from "../components"

export type _Collision_Id = `${EntityId}-${EntityId}`

export interface _Collision
{
    state: CollisionState
    resolve?: (current: Entity, target: Entity) => void
    displacements: [Vector3, Vector3]
}

export enum CollisionState
{
    None = 0,
    Enter,
    Update,
    Exit
}

export interface Collision
{
    current: Entity
    other: Entity
    state: CollisionState
    resolve?: (current: Entity, target: Entity) => void
}

export type CollisionResult = [Vector3, Vector3]

export type CollisionTest<T extends Collider> = (leftPosition: Transform, leftCollider: T, rightPosition: Transform, rightCollider: T) => CollisionResult | undefined
export type CollisionDetect<T extends Collider> = (leftPosition: Vector3, leftCollider: T, rightPosition: Vector3, rightCollider: T, ...rest: any[]) => boolean
export type CollisionResovle<T extends Collider> = (leftPosition: Vector3, leftCollider: T, rightPosition: Vector3, rightCollider: T, ...rest: any[]) => CollisionResult
