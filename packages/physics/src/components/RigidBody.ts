import { Vector3 } from "@fwge/common"
import { Component, Game } from "@fwge/core";

interface IRigidBody
{
    mass?: number
    velocity?: Vector3
}

export class RigidBody extends Component
{
    Velocity: Vector3 = Vector3.Zero
    Mass: number

    constructor(game: Game)
    constructor(game: Game, rigidbody: IRigidBody)
    constructor(game: Game, rigidbody: IRigidBody = {})
    {
        super(game, RigidBody)

        this.Mass = rigidbody.mass ?? 1.0
        this.Velocity = rigidbody.velocity ?? Vector3.Zero
    }
}
