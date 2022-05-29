import { Vector3 } from "@fwge/common"
import { SphereCollider } from "../components"
import { CollisionDetect, CollisionResovle, CollisionTest } from "./types"

export const SphereSphere: CollisionTest<SphereCollider> = (leftPosition: Vector3, leftCollider: SphereCollider, rightPosition: Vector3, rightCollider: SphereCollider) =>
{
    if (detect(leftPosition, leftCollider, rightPosition, rightCollider))
    { 
        return resolve(leftPosition, leftCollider, rightPosition, rightCollider)
    }

    return undefined
}

export const detect: CollisionDetect<SphereCollider> = (aPosition: Vector3, aCollider: SphereCollider, bPosition: Vector3, bCollider: SphereCollider) =>
{
    const radiusSquared  = (aCollider.Radius + bCollider.Radius) ** 2
    const distanceSquared = (aPosition[0] - bPosition[0]) **2 + 
        (aPosition[1] - bPosition[1]) ** 2 + 
        (aPosition[2] - bPosition[2]) ** 2

    return distanceSquared <= radiusSquared
}

export const resolve: CollisionResovle<SphereCollider> = (aPosition: Vector3, aCollider: SphereCollider, bPosition: Vector3, bCollider: SphereCollider) =>
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
