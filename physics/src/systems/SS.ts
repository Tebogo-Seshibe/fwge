import { Scale, Vector3 } from "@fwge/common"
import { Entity, EntityId, Transform } from "@fwge/core"
import { SphereCollider } from "../components"
import { CollisionResult } from "./types"

declare global
{
    interface Window
    {
        detect_SS: (aPosition: [number, number, number], aRadius: number, bPosition: [number, number, number], bRadius: number) => boolean
        resolve_SS: (aPosition: [number, number, number], aRadius: number, bPosition: [number, number, number], bRadius: number) => CollisionResult
    }
}

export function SS_Detect(aPosition: Vector3, aRadius: number, bPosition: Vector3, bRadius: number): boolean
{
    const radiusSquared  = (aRadius + bRadius) ** 2
    const distanceSquared = (aPosition[0] - bPosition[0]) **2 + 
        (aPosition[1] - bPosition[1]) ** 2 + 
        (aPosition[2] - bPosition[2]) ** 2

    return distanceSquared <= radiusSquared
}

export function SS_Resolve(aPosition: Vector3, aCollider: SphereCollider, bPosition: Vector3, bCollider: SphereCollider): [Vector3, Vector3]
{
    const result: [Vector3, Vector3]  = [Vector3.ZERO, Vector3.ZERO]

    const currentCollider = aCollider
    const targetCollider = bCollider
    
    if (currentCollider.IsTrigger || targetCollider.IsTrigger)
    {
        return result
    }
    
    const currentPos = aPosition
    const targetPos = bPosition
    
    const centerDistance = Vector3.Distance(currentPos, targetPos)
    const radiusDistance = currentCollider.Radius + targetCollider.Radius

    if (centerDistance <= radiusDistance)
    {
        const overlap = (centerDistance - radiusDistance)
        const direction = Vector3.Diff(currentPos, targetPos)

        if (currentCollider.IsStatic)
        {
            result[1].Set(direction.Scale(overlap))
        }
        else if (targetCollider.IsStatic)
        {
            result[0].Set(direction.Scale(overlap))
        }
        else
        {
            direction.Scale(overlap / 2)
            result[0].Set(direction)
            result[1].Set(direction).Scale(-1)
        }
    }

    return result
}

export const detect_SS = (aPosition: [number, number, number], aRadius: number, bPosition: [number, number, number], bRadius: number): boolean =>
{
    const radiusSquared  = (aRadius + bRadius) ** 2
    const distanceSquared = (aPosition[0] - bPosition[0]) ** 2 + 
        (aPosition[1] - bPosition[1]) ** 2 + 
        (aPosition[2] - bPosition[2]) ** 2

    return distanceSquared <= radiusSquared
}

export const resolve_SS = (aPosition: [number, number, number], aRadius: number, bPosition: [number, number, number], bRadius: number): CollisionResult =>
{   
    const result: CollisionResult = [0, 0, 0, 0, 0, 0]
    
    const radiusDistance = aRadius + bRadius
    const centerDistance = Math.sqrt(
        (aPosition[0] - bPosition[0]) ** 2 + 
        (aPosition[1] - bPosition[1]) ** 2 + 
        (aPosition[2] - bPosition[2]) ** 2
    )

    if (centerDistance <= radiusDistance)
    {
        const overlap = (centerDistance - radiusDistance)
        const direction = [
            (bPosition[0] - aPosition[0]) * overlap,
            (bPosition[1] - aPosition[1]) * overlap,
            (bPosition[2] - aPosition[2]) * overlap,
        ]

        result[0] = direction[0] * overlap / 2
        result[1] = direction[1] * overlap / 2
        result[2] = direction[2] * overlap / 2

        result[3] = direction[0] * overlap / 2
        result[4] = direction[1] * overlap / 2
        result[5] = direction[2] * overlap / 2
    }

    return result
}