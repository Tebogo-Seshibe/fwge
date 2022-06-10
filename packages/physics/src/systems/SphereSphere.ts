import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { SphereCollider } from "../components"
import { CollisionDetect, CollisionResovle, CollisionTest } from "./types"

export const SphereSphere: CollisionTest<SphereCollider> = (leftTransform: Transform, leftCollider: SphereCollider, rightTransform: Transform, rightCollider: SphereCollider) =>
{
    if (detect(leftTransform.Position, leftCollider, rightTransform.Position, rightCollider))
    {
        return resolve(leftTransform.Position, leftCollider, rightTransform.Position, rightCollider)
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
    const result: [Vector3, Vector3] = [Vector3.Zero, Vector3.Zero]

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
        const direction = Vector3.Subtract(currentPos, targetPos)

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
            result[0].Set(direction).Scale(-1)
            result[1].Set(direction)
        }
    }

    return result
}
