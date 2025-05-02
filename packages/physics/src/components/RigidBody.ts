import { Vector3 } from "@fwge/common"
import { Component } from "@fwge/ecs"

interface IRigidBody
{
    mass?: number
    velocity?: Vector3
}

export class RigidBody extends Component
{
    Velocity: Vector3 = Vector3.Zero
    Mass: number

    constructor()
    constructor(rigidbody: IRigidBody)
    constructor(rigidbody: IRigidBody = {})
    {
        super(RigidBody)

        this.Mass = rigidbody.mass ?? 1.0
        this.Velocity = rigidbody.velocity ?? Vector3.Zero
    }
}
