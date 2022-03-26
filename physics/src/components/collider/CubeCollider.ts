import { Vector3 } from "@fwge/common"
import { Entity } from "@fwge/core"
import { Collider } from "./Collider"

interface ICubeCollider
{
    isTrigger?: boolean
    position?: Vector3
    material?: any
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class CubeCollider extends Collider
{
    public Height: number = 0.5
    public Width: number = 0.5
    public Depth: number = 0.5

    constructor()
    constructor(collider: ICubeCollider)
    constructor(collider: ICubeCollider = { })
    {
        super(
            collider.position ?? Vector3.ZERO,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit
        )
    }
}
