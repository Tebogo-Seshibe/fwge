import { Entity, Scene, Script, Transform } from "@fwge/core"
import { Collider, RigidBody } from "@fwge/physics"
import { Material, Mesh } from "@fwge/render"

interface ICube
{
    mesh: Mesh
    material: Material
    transform: Transform
    script: Script
    col: Collider
}

export class Cube extends Entity
{
    constructor(scene: Scene, args: ICube)
    {
        super(scene)

        this.AddComponent(args.mesh)
        this.AddComponent(args.material)
        this.AddComponent(args.transform)
        this.AddComponent(args.script)
        this.AddComponent(args.col)
    }
}
