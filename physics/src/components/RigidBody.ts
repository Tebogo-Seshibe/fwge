import { Vector3 } from "@fwge/common"
import { UniqueComponent } from "@fwge/core"

interface IRigidBody
{
    mass?: number
}

export class RigidBody extends UniqueComponent
{
    Velocity: Vector3 = Vector3.ZERO
    Mass: number

    constructor()
    constructor(rigidbody: IRigidBody)
    constructor(rigidbody: IRigidBody = {})
    {
        super()

        this.Mass = rigidbody.mass ?? 1.0
    }
}
