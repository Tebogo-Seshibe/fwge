import { Vector3 } from "@fwge/common"
import { Entity, Scene, Script, Transform } from "@fwge/core"
import { Colour4, PointLight } from "@fwge/render"

export class Light extends Entity
{
    x: number = 0
    transform: Transform

    constructor(scene: Scene)
    {
        super(scene)
        
        this.AddComponent(new Transform(
        {
            position: new Vector3(0, 0, -4.2) 
        }))
        this.AddComponent(new PointLight(
        {
            colour: new Colour4(1, 1, 1, 1),
            radius: 5,
            intensity: 5,
        }))
        this.AddComponent(new Script(
        {
            update: (delta: number) =>
            {
                this.x += delta / 500
                this.transform.Position.X = Math.cos(this.x) * 2
                this.transform.Position.Z = (Math.sin(this.x) * 5) - 10
            }
        }))
        
        this.transform = this.GetComponent(Transform)!
    }
}