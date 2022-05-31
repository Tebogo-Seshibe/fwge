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
    

    const collision = TestAxis(aVertices, bVertices, aUp)
        && TestAxis(aVertices, bVertices, aRight)
        && TestAxis(aVertices, bVertices, aForward)
        && TestAxis(aVertices, bVertices, bUp)
        && TestAxis(aVertices, bVertices, bRight)
        && TestAxis(aVertices, bVertices, bForward)

    if (collision)
    {
        return [Vector3.ZERO, Vector3.ZERO]
    }
}

function TestAxis(aVertices: Vector3[], bVertices: Vector3[], axis: Vector3): boolean
{
    let aMin = Number.POSITIVE_INFINITY
    let bMin = Number.POSITIVE_INFINITY

    let aMax = Number.NEGATIVE_INFINITY
    let bMax = Number.NEGATIVE_INFINITY

    for (const vertex of aVertices)
    {
        const dot = axis.Dot(vertex)
        if (dot <= aMin) aMin = dot
        if (dot >= aMax) aMax = dot
    }

    for (const vertex of bVertices)
    {
        const dot = axis.Dot(vertex)
        if (dot <= bMin) bMin = dot
        if (dot >= bMax) bMax = dot
    }

    return (
        (aMin <= bMin && bMin <= aMax) ||
        (bMin <= aMin && aMin <= bMax) ||
        (aMin <= bMax && bMax <= aMax) ||
        (bMin <= aMax && aMax <= bMax)
    )
}