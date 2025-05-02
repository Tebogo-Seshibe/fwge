import { Polygon3D, Vector3 } from "@fwge/common"
import { Collider } from "./Collider"
import { Entity } from "@fwge/ecs"

interface ISphereCollider
{
    material?: any
    isStatic?: boolean
    isTrigger?: boolean
    radius?: number
    position?: Vector3
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}
export class SphereCollider extends Collider
{
    public Radius: number

    constructor()
    constructor(collider: ISphereCollider)
    constructor(collider: ISphereCollider = {})
    {
        super(
            collider.position ?? Vector3.Zero,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit,
            new Polygon3D([])
        )

        this.Radius = collider.radius ?? 0.5
    }
}