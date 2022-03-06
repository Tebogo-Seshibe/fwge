import { Vector3 } from "@fwge/common"
import { Collider } from "./Collider"

interface ICubeCollider
{
    isTrigger?: boolean
    position?: Vector3
    material?: any
}

export class CubeCollider extends Collider
{
    constructor()
    constructor(collider: ICubeCollider)
    constructor(collider: ICubeCollider = { })
    {
        super(collider.position ?? Vector3.ZERO, collider.isTrigger ?? false, collider.material)
    }
}
