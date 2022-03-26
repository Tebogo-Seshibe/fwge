import { Vector3 } from "@fwge/common"
import { Entity, Scene, Script, Transform } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Colour4, PointLight } from "@fwge/render"

export class Light extends Entity
{
    transform: Transform
    light: PointLight

    constructor(
        scene: Scene, 
        colour: Colour4,
        private x: number = 0)
    {
        super(scene)
        
        this.AddComponent(new Transform(
        {
            position: new Vector3(0, 0, -4.2) 
        }))
        this.AddComponent(new PointLight(
        {
            colour: colour,
            radius: 2,
            intensity: 2,
        }))
        this.AddComponent(new Input(
        {
            onInput: ({ Keyboard }: IInputArgs, delta: number) =>
            {
                if (Keyboard.KeyUp === KeyState.DOWN)
                {
                    this.light.Intensity += (delta / 100)
                }
                if (Keyboard.KeyDown === KeyState.DOWN)
                {
                    this.light.Intensity -= (delta / 100)
                }
                if (Keyboard.KeyRight === KeyState.DOWN)
                {
                    this.light.Radius += (delta / 100)
                }
                if (Keyboard.KeyLeft === KeyState.DOWN)
                {
                    this.light.Radius -= (delta / 100)
                }
            } 
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
        this.light = this.GetComponent(PointLight)!
    }
}