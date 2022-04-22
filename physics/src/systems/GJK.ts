import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { MeshCollider } from "../components"

let doP
export function GJK(leftCollider: MeshCollider, rightCollider: MeshCollider): boolean
{
    const simplex: Simplex3D = new Simplex3D()
    const leftPosition = leftCollider.Owner!.GetComponent(Transform)!.Position.Clone().Sum(leftCollider.Position)
    const rightPosition = rightCollider.Owner!.GetComponent(Transform)!.Position.Clone().Sum(rightCollider.Position)
    
    const leftPoints = leftCollider.CalculatedVertices
    const rightPoints = rightCollider.CalculatedVertices
    
    let direction = Vector3.Diff(leftPosition, rightPosition).Normalize()
    let support = calcSupport(leftPoints, rightPoints, direction)

    simplex.add(support)
    direction.Set(support).Scale(-1).Normalize()

    while (true)
    {
        support = calcSupport(leftPoints, rightPoints, direction)
        // console.group('support.Dot(direction)')
        // console.log(support)
        // console.log(direction)
        console.log(support.Dot(direction))
        // console.groupEnd()s
        if (support.Dot(direction) < 0)
        {
            return false
        }

        simplex.add(support)
        if (simplex.update(direction))
        {
            return true
        }
    }
}

export function findFurthest(points: Vector3[], direction: Vector3): Vector3
{
    let maxPoint!: Vector3
    let maxDistance: number = Number.MIN_VALUE

    for (const currPoint of points)
    {
        const currDistance = currPoint.Dot(direction)
        // console.log(currDistance)
        if (currDistance > maxDistance)
        {
            maxDistance = currDistance
            maxPoint = currPoint
        }
    }

    return maxPoint
}

export function calcSupport(leftPoints: Vector3[], rightPoints: Vector3[], direction: Vector3): Vector3
{
    const furthestLeft = findFurthest(leftPoints, direction)
    const furthestRight = findFurthest(rightPoints, direction.Clone().Scale(-1))
    const support = Vector3.Diff(furthestLeft, furthestRight)
    
    // console.log(furthestLeft, furthestRight, support)
    return support
     
}

export function tripleCrossProduct(a: Vector3, b: Vector3): Vector3
{
    return a.Clone().Cross(b).Cross(a)
}

export class Simplex3D
{
    private count: number = 0
    private points: [Vector3, Vector3, Vector3, Vector3] =
    [
        Vector3.ZERO,
        Vector3.ZERO,
        Vector3.ZERO,
        Vector3.ZERO
    ]

    get first(): Vector3
    {
        return this.points[0]
    }

    get last(): Vector3
    {
        return this.points[this.count - 1]
    }

    add(point: Vector3): void
    {
        this.points[this.count++].Set(point)
    }

    sameDirection(vector: Vector3, direction: Vector3): boolean
    {
        return direction.Dot(vector) > 0
    }

    update(direrction: Vector3): boolean
    {
        console.log(this.count)
        switch (this.count)
        {
            case 2:
                return this.lineCase(direrction)
            case 3:
                return this.triangleCase(direrction)
            case 4:
                return this.tetrahedronCase(direrction)
        }

        return false
    }

    lineCase(direction: Vector3): boolean
    {
        const A = this.points[0]
        const B = this.points[1]

        const AB = Vector3.Diff(A, B)
        const AO = A.Clone().Scale(-1)

        if (this.sameDirection(AB, AO))
        {
            direction.Set(AB).Cross(AO).Cross(AB)
        }
        else
        {
            this.count--
            direction.Set(AO)
        }

        return false
    }

    triangleCase(direction: Vector3): boolean
    {
        const A = this.points[0]
        const B = this.points[1]
        const C = this.points[2]

        const AB = Vector3.Diff(A, B)
        const AC = Vector3.Diff(A, C)
        const AO = A.Clone().Scale(-1)

        const ABC = AB.Clone().Cross(AC)

        if (this.sameDirection(ABC.Clone().Cross(AC), AO))
        {
            if (this.sameDirection(AC, AO))
            {
                this.points[1].Set(C)
                this.count--
                direction.Set(AC).Cross(AO).Cross(AC)
            }
            else
            {
                return this.lineCase(direction)
            }
        }
        else
        {
            if (this.sameDirection(AB.Clone().Cross(ABC), AO))
            {
                this.count--
                return this.lineCase(direction)
            }
            else
            {
                if (this.sameDirection(ABC, AO))
                {
                    direction.Set(ABC)
                }
                else
                {
                    this.points.swap(1, 2)
                    direction.Set(ABC).Scale(-1)
                }
            }
        }
        
        return false
    }

    tetrahedronCase(direction: Vector3): boolean
    {
        const A = this.points[0]
        const B = this.points[1]
        const C = this.points[2]
        const D = this.points[3]

        const AB = Vector3.Diff(A, B)
        const AC = Vector3.Diff(A, C)
        const AD = Vector3.Diff(A, D)
        const AO = A.Clone().Scale(-1)

        const ABC = AB.Clone().Cross(AC)
        const ACD = AC.Clone().Cross(AD)
        const ADB = AD.Clone().Cross(AB)

        if (this.sameDirection(ABC, AO))
        {
            this.count--
            return this.triangleCase(direction)
        }
        
        if (this.sameDirection(ACD, AO))
        {
            this.points.swap(1, 2)
            this.points.swap(2, 3)
            this.count--
            return this.triangleCase(direction)
        }

        if (this.sameDirection(ADB, AO))
        {
            this.points.swap(1, 3)
            this.points.swap(2, 3)
            this.count--
            return this.triangleCase(direction)
        }

        return true
    }
}