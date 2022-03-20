import { Colour4 } from "../../base"
import { Light } from "./Light"

interface IPointLight
{
    colour?: Colour4
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
        super(light.colour)

        this.Intensity = !Number.isNaN(light.intensity) ? light.intensity! : 1
        this.Radius = !Number.isNaN(light.radius) ? light.radius! : 5
    }
}
