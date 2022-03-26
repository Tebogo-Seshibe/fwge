import { Entity, Scene, Script, Transform } from "@fwge/core"
import { Material, Mesh, Shader } from "@fwge/render"

export class Cube extends Entity
{
    private transform: Transform

    constructor(scene: Scene, args:
    {
        mesh: Mesh,
        material: Material,
        shader: Shader,
        transform: Transform,
        script: Script,
    })
    {
        super(scene)

        this.AddComponent(args.mesh)
        this.AddComponent(args.material)
        this.AddComponent(args.shader)
        this.AddComponent(args.transform)
        this.AddComponent(args.script)

        this.transform = this.GetComponent(Transform)!
    }
}