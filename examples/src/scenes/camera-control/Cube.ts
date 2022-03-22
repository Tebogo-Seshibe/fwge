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
    })
    {
        super(scene)

        this.AddComponent(args.mesh)
        this.AddComponent(args.material)
        this.AddComponent(args.shader)
        this.AddComponent(args.transform)
        this.AddComponent(new Script(
        {
            start: () =>
            {
                this.transform.Rotation.Set(0, Math.random() * 360, Math.random() * 360)
            },
            update: (delta: number) =>
            {
                this.transform.Rotation.Y += delta / 5
                this.transform.Rotation.Z += delta / 12
            }
        }))

        this.transform = this.GetComponent(Transform)!
    }
}