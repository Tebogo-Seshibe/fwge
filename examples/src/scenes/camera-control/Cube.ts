import { Entity, Scene, Script, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Material, Mesh, Shader } from "@fwge/render"

export class Cube extends Entity
{
    x: number = 0
    transform: Transform
    speed: number = 2

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
        // this.AddComponent(new Input(
        // {
        //     onInput: ({ Keyboard }: IInputArgs, delta) =>
        //     {
        //         if (Keyboard.KeyG == KeyState.DOWN)
        //         {
        //             console.log('I pressed G')
        //         }
        //         if (Keyboard.KeyLeft == KeyState.DOWN)
        //         {
        //             this.transform.Position.X -= this.speed / delta
        //         }
        //         if (Keyboard.KeyRight == KeyState.DOWN)
        //         {
        //             this.transform.Position.X -= this.speed / delta
        //         }
        //     }
        // }))
        this.AddComponent(new Script(
        {
            start: () =>
            {
                this.x = this.transform.Position.X*this.transform.Position.Y*this.transform.Position.Z
                this.transform.Rotation.Set(0, Math.random() * 360, Math.random() * 360)
            },
            update: (delta: number) =>
            {
                this.x += delta / 1000
                this.transform.Rotation.Y += delta / 5
                this.transform.Rotation.Z += delta / 12
            }
        }))

        this.transform = this.GetComponent(Transform)!
        // this.RemoveComponent(Script)!
    }
}