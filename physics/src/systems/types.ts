import { Vector3 } from "@fwge/common"
import { Entity, EntityId } from "@fwge/core"

declare global
{
    interface Worker
    {
        id: number
    }
    
    interface Window
    {
        id: number
    }
}

export type CollisionDetectMethod = (leftPosition: [number, number, number], leftCollider: number[], rightPosition: [number, number, number], rightCollider: number[]) => boolean
export type CollisionResovleMethod = (leftPosition: [number, number, number], leftCollider: number[], rightPosition: [number, number, number], rightCollider: number[]) => CollisionResult

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

export type CollisionDetectionArgs =
{
    leftCollider: number[],
    leftPosition: [number, number, number],
    rightCollider: number[],
    rightPosition: [number, number, number],
    detect: string
    resolve: string
}

export enum DetectResolveType
{
    SphereSphere,
    CubeCube
}
export type CollisionTest  = [
    DetectResolveType,
    EntityId,
    EntityId,
    ...number[]
]
export type CollisionResult = [
    number, number, number, // displacement
    number, number, number  // displacement
]

export type WorkerArgs =
{
    data: CollisionDetectionArgs
}