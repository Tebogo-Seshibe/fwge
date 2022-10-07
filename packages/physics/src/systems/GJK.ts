import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { Collider } from "../components"
import { Simplex3D } from "./Simplex"
import { calcSupport } from "./utils"

export function GJK(leftPosition: Transform, leftCollider: Collider, rightPosition: Transform, rightCollider: Collider, simplex: Simplex3D)
{    
    const direction = Vector3.Subtract(leftPosition.Position, rightPosition.Position)
    const leftVectors = leftCollider.CalculatedVertices(leftPosition)
    const rightVectors = rightCollider.CalculatedVertices(rightPosition)
    const support = calcSupport(leftVectors, rightVectors, direction)

    simplex.push(support)
    Vector3.Negate(support, direction)

    while (true)
    {
        const newSupport = calcSupport(leftVectors, rightVectors, direction)
        
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
