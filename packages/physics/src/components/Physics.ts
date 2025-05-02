import { Component } from "@fwge/ecs"
import { Collider } from "."
import { RigidBody } from "./RigidBody"

export class Physics extends Component
{
    collider!: Collider
    rigidbody!: RigidBody
}