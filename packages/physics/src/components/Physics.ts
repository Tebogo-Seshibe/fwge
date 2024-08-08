import { Component } from "@fwge/core";
import { Collider } from "."
import { RigidBody } from "./RigidBody"

export class Physics extends Component
{
    collider!: Collider
    rigidbody!: RigidBody
}