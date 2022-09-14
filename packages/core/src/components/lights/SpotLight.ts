import { Colour3, Vector3, Vector3Array } from "@fwge/common"
import { Shader } from "../../base"
import { Transform } from "../Transform"
import { ILight, Light } from "./Light"

export interface ISpotLight extends ILight
{
    angle?: number
    radius?: number
    direction?: Vector3 | Vector3Array
    castShadows?: boolean
}

export class SpotLight extends Light
{
    Angle: number
    Radius: number
    readonly Direction: Vector3
    CastShadows: boolean

    constructor()
    constructor(light: ISpotLight)
    constructor(light: ISpotLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as Vector3Array),
            light.intensity,
            new Float32Array(12)
        )

        this.Radius = light.radius ?? 5
        this.Angle = light.angle ?? 15
        this.Direction = light.direction ? new Vector3(light.direction) : new Vector3(0, -1, 0)
        this.CastShadows = light.castShadows ?? false
    }

    override Bind(shader: Shader, index?: number): void
    {
        this.BufferData.set(this.Colour, 0)
        this.BufferData[3] = this.Intensity
        this.BufferData.set(this.Owner!.GetComponent(Transform)!.GlobalPosition(), 4)
        this.BufferData[7] = this.Radius
        this.BufferData.set(this.Direction, 8)
        this.BufferData[11] = this.Angle
        {
            `
                [R] [G] [B] [intensity]
                [X] [Y] [Z] [radius]
                [X] [Y] [Z] [angle]
            `
        }
        super.Bind(shader)
    }
}
