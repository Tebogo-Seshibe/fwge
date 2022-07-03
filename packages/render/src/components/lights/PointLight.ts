import { Colour4 } from "../../base"
import { Light } from "./Light"

export interface IPointLight
{
    colour?: [number, number, number, number]
    intensity?: number
    radius?: number
}

export class PointLight extends Light
{
    Intensity: number
    Radius: number

    constructor()
    constructor(light: IPointLight)
    constructor(light: IPointLight = { })
    {
        super(new Colour4(
            light.colour! ?? [255, 255, 255, 255]
        ))

        this.Intensity = !Number.isNaN(light.intensity) ? light.intensity! : 1
        this.Radius = !Number.isNaN(light.radius) ? light.radius! : 5
    }
}
