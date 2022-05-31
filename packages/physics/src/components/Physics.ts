import { UniqueComponent } from "@fwge/core"
import { Collider } from "."
import { RigidBody } from "./RigidBody"

export class Physics extends UniqueComponent
{
    collider!: Collider
    rigidbody!: RigidBody
}