import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { Collider } from "../components"
import { Polytope } from "./Polytope"
import { Simplex3D } from "./Simplex"
import { addIfUniqueEdge, calcSupport, sameDirection } from "./utils"

export function EPA(leftPosition: Transform, leftCollider: Collider, rightPosition: Transform, rightCollider: Collider, simplex: Simplex3D)
{
    const leftVectors = leftCollider.CalculatedVertices(leftPosition)
    const rightVectors = rightCollider.CalculatedVertices(rightPosition)

    const offset: [Vector3, Vector3] = [Vector3.Zero, Vector3.Zero]
    const polytope: Polytope = new Polytope(...simplex)
    const faces: number[] = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 1,
        1, 2, 3,
    ]

    let [normals, minFace] = polytope.getFaceNormal(faces)
    const minNormal: Vector3 = new Vector3()
    let minDistance: number = Number.MAX_VALUE

    while (minDistance === Number.MAX_VALUE)
    {
        minNormal.Set(normals[minFace][0], normals[minFace][1], normals[minFace][2])
        minDistance = normals[minFace][3]

        const support: Vector3 = calcSupport(leftVectors, rightVectors, minNormal)
        const distance: number = minNormal.Dot(support)

        if (Math.abs(distance - minDistance) > 0.001)
        {
            minDistance = Number.MAX_VALUE
            
            const uniqueEdges: [number, number][] = []

            for (let i = 0; i < normals.length; ++i)
            {
                if (sameDirection(new Vector3(normals[i]), support))
                {
                    const faceIndex: number = i * 3

                    addIfUniqueEdge(uniqueEdges, faces, faceIndex + 0, faceIndex + 1)
                    addIfUniqueEdge(uniqueEdges, faces, faceIndex + 1, faceIndex + 2)
                    addIfUniqueEdge(uniqueEdges, faces, faceIndex + 2, faceIndex + 0)

                    faces[faceIndex + 2] = faces.pop()!
                    faces[faceIndex + 1] = faces.pop()!
                    faces[faceIndex + 0] = faces.pop()!

                    normals[i].Set(normals.pop()!)
                    
                    --i
                }
            }

            const newFaces: number[] = []
            for (const [edgePoint1, edgePoint2] of uniqueEdges)
            {
                newFaces.push(edgePoint1, edgePoint2, polytope.length)
            }
            polytope.push(support)

            const [newNormals, newMinFace] = polytope.getFaceNormal(newFaces)
            let oldMinDistance = Number.MAX_VALUE

            for (let i = 0; i < normals.length; ++i)
            {
                if (normals[i][3] < oldMinDistance)
                {
                    oldMinDistance = normals[i][3]
                    minFace = i
                }
            }

            if (newNormals[newMinFace][3] < oldMinDistance)
            {
                minFace = newMinFace + normals.length
            }

            faces.push(...newFaces)
            normals.push(...newNormals)
        }
    }

    return minNormal.Normalize().Scale(minDistance)
}
