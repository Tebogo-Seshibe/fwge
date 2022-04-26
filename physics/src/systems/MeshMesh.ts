import { Vector3, Vector4 } from "@fwge/common"
import { Collider, MeshCollider } from "../components"
import { CollisionDetect, CollisionResovle, CollisionTest } from "./types"

export class Simplex3D extends Array<Vector3>
{
    public handleSimplex(direction: Vector3): boolean
    {
        switch (this.length)
        {
            case 2: return this.lineCase(direction)
            case 3: return this.triangleCase(direction)
            case 4: return this.tetrahedronCase(direction)
        }

        return false
    }

    private reset(...values: Vector3[])
    {
        while (this.length > values.length)
        {
            this.pop()
        }

        for (let i = 0; i < values.length; ++i)
        {
            this[i] = values[i]
        }
    }

    private lineCase(direction: Vector3): boolean
    {
        const [B, A] = this

        const AB = Vector3.Diff(B, A)
        const AO = A.Clone().Scale(-1)

        if (sameDirection(AB, AO))
        {
            direction.Set(AB).Cross(AO).Cross(AB)
        }
        else
        {
            this.reset(A)
            direction.Set(AO)
        }

        return false
    }

    private triangleCase(direction: Vector3): boolean
    {
        const [C, B, A] = this

        const AB = Vector3.Diff(B, A).Normalize()
        const AC = Vector3.Diff(C, A).Normalize()
        const AO = A.Clone().Scale(-1).Normalize()

        const ABC = Vector3.Cross(AB, AC)
        
        if (sameDirection(Vector3.Cross(ABC, AC), AO))
        {
            if (sameDirection(AC, AO))
            {
                this.reset(C, A)
                direction.Set(AC).Cross(AO).Cross(AC)
            }
            else
            {
                this.reset(B, A)
                return this.lineCase(direction)
            }
        }
        else
        {
            if (sameDirection(Vector3.Cross(AB, ABC), AO))
            {
                this.reset(B, A)
                return this.lineCase(direction)
            }
            else
            {
                direction.Set(ABC)

                if (!sameDirection(ABC, AO))
                {
                    this.reset(B, C, A)
                    direction.Scale(-1)
                }
            }
        }
        
        return false
    }

    private tetrahedronCase(direction: Vector3): boolean
    {
        const [D, C, B, A] = this

        const AB = Vector3.Diff(B, A)
        const AC = Vector3.Diff(C, A)
        const AD = Vector3.Diff(D, A)
        const AO = A.Clone().Scale(-1)

        const ABC = Vector3.Cross(AB, AC)
        const ACD = Vector3.Cross(AC, AD)
        const ADB = Vector3.Cross(AD, AB)

        if (sameDirection(ABC, AO))
        {
            this.reset(C, B, A)
            return this.triangleCase(direction)
        }
        
        if (sameDirection(ACD, AO))
        {
            this.reset(D, C, A)
            return this.triangleCase(direction)
        }

        if (sameDirection(ADB, AO))
        {
            this.reset(B, D, A)
            return this.triangleCase(direction)
        }

        return true
    }
}


export function sameDirection(direction: Vector3, vector: Vector3): boolean
{
    return direction.Dot(vector) > 0
}

export function calcSupport(left: Collider, right: Collider, direction: Vector3): Vector3
{
    return Vector3.Diff(
        left.findFurthest(direction),
        right.findFurthest(direction.Clone().Scale(-1))
    )
}

export const GJK: CollisionDetect<MeshCollider> = (leftPosition: Vector3, leftCollider: MeshCollider, rightPosition: Vector3, rightCollider: MeshCollider, simplex: Simplex3D) =>
{    
    const direction = Vector3.Diff(leftPosition, rightPosition)
    const support = calcSupport(leftCollider, rightCollider, direction)

    simplex.push(support)
    direction.Set(support).Scale(-1)

    while (true)
    {
        const newSupport = calcSupport(leftCollider, rightCollider, direction)
        
        if (newSupport.Dot(direction) <= 0)
        {
            return false
        }
        
        simplex.push(newSupport)
        if (simplex.handleSimplex(direction))
        {
            return true
        }
    }
}

export class Polytope extends Array<Vector3>
{
    getFaceNormal(faces: number[]): [Vector4[], number]
    {
        const normals: Vector4[] = []
        let minTriangle: number = 0
        let minDot: number = Number.MAX_VALUE

        for (let i = 0; i < faces.length; i +=3)
        {
            const A = this[faces[i + 0]]
            const B = this[faces[i + 1]]
            const C = this[faces[i + 2]]
            
            const AB = Vector3.Diff(B, A)
            const AC = Vector3.Diff(C, A)

            const normal = Vector3.Cross(AB, AC).Normalize()
            let dot = normal.Dot(A)

            if (dot < 0)
            {
                normal.Scale(-1)
                dot *= -1
            }

            normals.push(new Vector4(normal[0], normal[1], normal[2], dot))

            if (dot < minDot)
            {
                minTriangle = i / 3
                minDot = dot
            }
        }

        return [normals, minTriangle]
    }
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

export const EPA: CollisionResovle<MeshCollider> = (_1: Vector3, leftCollider: MeshCollider, _2: Vector3, rightCollider: MeshCollider, simplex: Simplex3D) =>
{
    const offset: [Vector3, Vector3] = [Vector3.ZERO, Vector3.ZERO]
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

        const support: Vector3 =  calcSupport(leftCollider, rightCollider, minNormal)
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

    minNormal.Scale(minDistance)

    if (leftCollider.IsStatic)
    {
        offset[0].Set(minNormal)
    }   
    else if (rightCollider.IsStatic)
    {
        offset[1].Set(minNormal.Scale(-1))
    } 
    else
    {
        minNormal.Scale(0.5)
        offset[1].Set(minNormal)
        offset[0].Set(minNormal.Scale(-1))
    }

    return offset
}

export const MeshMesh: CollisionTest<MeshCollider> = (leftPosition: Vector3, leftCollider: MeshCollider, rightPosition: Vector3, rightCollider: MeshCollider) =>
{
    const simplex: Simplex3D = new Simplex3D()

    if (GJK(leftPosition, leftCollider, rightPosition, rightCollider, simplex))
    {
        if (leftCollider.IsTrigger || rightCollider.IsTrigger)
        {
            return [Vector3.ZERO, Vector3.ZERO]
        }

        return EPA(leftPosition, leftCollider, rightPosition, rightCollider, simplex)
    }

    return undefined
}
