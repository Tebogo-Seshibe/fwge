import { Vector3 } from "@fwge/common"
import { Entity } from "@fwge/core"
import { Collider } from "./Collider"

interface ISphereCollider
{
    material?: any
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
            collider.position ?? Vector3.ZERO,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit            
        )

        this.Radius = collider.radius ?? 0.5
    }
}