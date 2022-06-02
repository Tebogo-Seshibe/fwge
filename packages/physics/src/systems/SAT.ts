import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { CubeCollider } from "../components"
import { CollisionResult } from "./types"

export function SAT(aTransform: Transform, aCollider: CubeCollider, bTransform: Transform, bCollider: CubeCollider): CollisionResult | undefined
{
    const [aUp, aRight, aForward] = aCollider.GetDimentions(aTransform)
    const [bUp, bRight, bForward] = bCollider.GetDimentions(bTransform)

    const aVertices = aCollider.GetVertices(aTransform)
    const bVertices = bCollider.GetVertices(bTransform)

    const aCenter = CalculateCenter(aVertices)
    const bCenter = CalculateCenter(bVertices)
    const direction = Vector3.Diff(bCenter, aCenter)

    const axes = [
        aUp.Normalize(),
        aRight.Normalize(),
        aForward.Normalize(),
        bUp.Normalize(),
        bRight.Normalize(),
        bForward.Normalize(),
        Vector3.Cross(aUp, bUp).Normalize(),
        Vector3.Cross(aUp, bRight).Normalize(),
        Vector3.Cross(aUp, bForward).Normalize(),
        Vector3.Cross(aRight, bUp).Normalize(),
        Vector3.Cross(aRight, bRight).Normalize(),
        Vector3.Cross(aRight, bForward).Normalize(),
        Vector3.Cross(aForward, bUp).Normalize(),
        Vector3.Cross(aForward, bRight).Normalize(),
        Vector3.Cross(aForward, bForward).Normalize(),
    ].filter(x => x.Length !== 0)

    let offset = Vector3.ZERO
    let min = Number.POSITIVE_INFINITY

    for (const axis of axes)
    {
        const overlap = TestAxis(aVertices, bVertices, axis)
        if (overlap === undefined)
        {
            return undefined
        }

        if (overlap < min)
        {
            min = overlap
            offset = axis
        }
    }
    
    if (offset.Dot(direction) > 0)
    {
        offset.Scale(-1)
    }

    offset.Scale(min)
    const [aOffset, bOffset] = [offset.Clone(), offset.Clone().Scale(-1)]
    if (aCollider.IsTrigger || bCollider.IsTrigger)
    {
        aOffset.Set(0)
        bOffset.Set(0)
    }
    else if (aCollider.IsStatic)
    {
        aOffset.Set(0)
        bOffset.Scale(2)
    }
    else if (bCollider.IsStatic)
    {
        bOffset.Set(0)
        aOffset.Scale(2)
    }

    return [aOffset, bOffset]
}

function CalculateCenter(vertices: Vector3[]): Vector3
{
    const vec = new Vector3()
    for (const vertex of vertices)
    {
        vec.Sum(vertex)
    }
    return vec.Scale(1 / vertices.length)
}

function TestAxis(aVertices: Vector3[], bVertices: Vector3[], axis: Vector3): number | undefined
{    
    let aMin = Number.POSITIVE_INFINITY
    let bMin = Number.POSITIVE_INFINITY
    let aMax = Number.NEGATIVE_INFINITY
    let bMax = Number.NEGATIVE_INFINITY

    for (let i = 0; i < aVertices.length; ++i)
    {
        const aDot = axis.Dot(aVertices[i])
        if (aDot <= aMin) aMin = aDot
        if (aDot >= aMax) aMax = aDot
        
        const bDot = axis.Dot(bVertices[i])
        if (bDot <= bMin) bMin = bDot
        if (bDot >= bMax) bMax = bDot
    }

    const longSpan = Math.max(aMax, bMax) - Math.min(aMin, bMin)
    const sumSpan = aMax - aMin + bMax - bMin

    if (sumSpan >= longSpan)
    {
        return sumSpan - longSpan
    }
}
