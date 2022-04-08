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
        private x: number = 0
    ) {
        super(scene)
        
        this.AddComponent(new Transform())
        this.AddComponent(new PointLight(
        {
            colour: colour,
            radius: 4.5,
            intensity: 2,
        }))
        this.AddComponent(new Input(
        {
            onInput: ({ Keyboard }: IInputArgs, delta: number) =>
            {
                if (Keyboard.KeyUp === KeyState.DOWN)
                {
                    this.light.Intensity += delta
                }
                if (Keyboard.KeyDown === KeyState.DOWN)
                {
                    this.light.Intensity -= delta
                }
                if (Keyboard.KeyRight === KeyState.DOWN)
                {
                    this.light.Radius += delta
                }
                if (Keyboard.KeyLeft === KeyState.DOWN)
                {
                    this.light.Radius -= delta
                }
            } 
        }))
        this.AddComponent(new Script(
        {
            update: (delta: number) =>
            {
                this.x += delta
                this.transform.Position.X = Math.cos(this.x) * 5
                this.transform.Position.Z = (Math.sin(this.x) * 5) - 10
                this.transform.Position.Y = this.Id % 2 === 0 
                    ? (Math.sin(this.x) * 5)
                    : (Math.cos(this.x) * 5)
            }
        }))
        
        this.transform = this.GetComponent(Transform)!
        this.light = this.GetComponent(PointLight)!
    }
}
