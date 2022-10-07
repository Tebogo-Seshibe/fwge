import { Vector3 } from "@fwge/common"
import { Collider } from "../components"

export function calcSupport(
    leftVectors: Vector3[],
    rightVectors: Vector3[],
    direction: Vector3): Vector3
{
    return Vector3.Subtract(
        Collider.FindFurthest(leftVectors, direction),
        Collider.FindFurthest(rightVectors, Vector3.Negate(direction))
    )
}

export function sameDirection(vectorA: Vector3, vectorB: Vector3): boolean
{
    return vectorA.Dot(vectorB) > 0
}

export function addIfUniqueEdge(edges: [number, number][], faces: number[], a: number, b: number): void
{
    const reverse = edges.findIndex(
        ([x, y]:[number, number], index: number) => {
            if (faces[b] === x && faces[a] === y) {
                return index
            }

            return undefined
        }
    )

    if (reverse !== undefined && reverse !== -1)
    {
        edges.splice(reverse, 1)
    }
    else
    {
        edges.push([faces[a], faces[b]])
    }
}
