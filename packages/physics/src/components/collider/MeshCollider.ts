import { GL, Matrix2, Matrix4, Polygon3D, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Collider } from "./Collider"

interface ISphereCollider
{
    vertices: Vector3[]
    outline: number[]
    material?: any
    isStatic?: boolean
    isTrigger?: boolean
    position?: Vector3
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class MeshCollider extends Collider
{
    constructor(collider: ISphereCollider)
    {
        super(
            collider.position ?? Vector3.Zero,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit,
            new Polygon3D(collider.vertices)
        )
    }
}
