import { Vector3 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Collider, CubeCollider } from "../components"

export function AABB(aPosition: Vector3, aCollider: CubeCollider, bPosition: Vector3, bCollider: CubeCollider): boolean
{
    const a_min_x = aPosition[0] - (aCollider.Width  / 2)
    const a_max_x = aPosition[0] + (aCollider.Width  / 2)
    const a_min_y = aPosition[1] - (aCollider.Height / 2)
    const a_max_y = aPosition[1] + (aCollider.Height / 2)
    const a_min_z = aPosition[2] - (aCollider.Depth  / 2)
    const a_max_z = aPosition[2] + (aCollider.Depth  / 2)
    
    const b_min_x = bPosition[0] - (bCollider.Width  / 2)
    const b_max_x = bPosition[0] + (bCollider.Width  / 2)
    const b_min_y = bPosition[1] - (bCollider.Height / 2)
    const b_max_y = bPosition[1] + (bCollider.Height / 2)
    const b_min_z = bPosition[2] - (bCollider.Depth  / 2)
    const b_max_z = bPosition[2] + (bCollider.Depth  / 2)

    return (
        (a_min_x <= b_max_x && a_max_x >= b_min_x) &&
        (a_min_y <= b_max_y && a_max_y >= b_min_y) &&
        (a_min_z <= b_max_z && a_max_z >= b_min_z)
    )
}

export function resolveAABB(current: Entity, target: Entity): void
{
    const currentCollider = current.GetComponent(CubeCollider)!
    const targetCollider = target.GetComponent(CubeCollider)!
    
    if (currentCollider.IsTrigger || currentCollider.IsStatic)
    {
        return
    }
    
    const currentPos = current.GetComponent(Transform)!.Position
    const targetPos = target.GetComponent(Transform)!.Position

    const overlap = this._calculateOverlap(currentPos, currentCollider, targetPos, targetCollider)
    const currentDisplacement = this.displacements.get(current.Id) ?? Vector3.ZERO                

    if (!targetCollider.IsStatic)
    {
        currentDisplacement.Sum(overlap.Scale(0.5))
    }
    else
    {
        currentDisplacement.Sum(overlap)
    }

    this.displacements.set(current.Id, currentDisplacement)
}