import { Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { Collider } from "../components"
import { EPA } from "./EPA"
import { GJK } from "./GJK"
import { Simplex3D } from "./Simplex"

export function Test(leftTransform: Transform, leftCollider: Collider, rightTransform: Transform, rightCollider: Collider)
{
    const simplex = new Simplex3D()

    if (GJK(leftTransform, leftCollider, rightTransform, rightCollider, simplex))
    {
        if (leftCollider.IsTrigger || rightCollider.IsTrigger)
        {
            return [ Vector3.Zero, Vector3.Zero ]
        }

        const overlap = EPA(leftTransform, leftCollider, rightTransform, rightCollider, simplex)
        
        if (leftCollider.IsStatic)
        {
            return [Vector3.Zero, overlap.Negate()]
        }
        else if (rightCollider.IsStatic)
        {
            return [overlap.Negate(), Vector3.Zero]
        }
        else
        {
            overlap.Scale(0.5)
            return [overlap, Vector3.Negate(overlap)]
        }
    }
}
