import { Polygon3D, Vector3 } from "@fwge/common"
import { Collider } from "./Collider"
import { Entity } from "@fwge/ecs"

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
