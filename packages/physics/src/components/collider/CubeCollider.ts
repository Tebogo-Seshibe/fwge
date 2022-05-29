import { Vector3 } from "@fwge/common"
import { Entity } from "@fwge/core"
import { Collider } from "./Collider"

interface ICubeCollider
{
    isStatic?: boolean
    isTrigger?: boolean
    position?: Vector3
    material?: any
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class CubeCollider extends Collider
{
    public Height: number = 1
    public Width: number = 1
    public Depth: number = 1

    constructor()
    constructor(collider: ICubeCollider)
    constructor(collider: ICubeCollider = { })
    {
        super(
            collider.position ?? Vector3.ZERO,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit
        )
    }
}
