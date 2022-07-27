import { Colour4 } from "@fwge/common"
import { Light } from "./Light"

export interface IPointLight
{
    colour?: [number, number, number, number]
    intensity?: number
    radius?: number
}

export class PointLight extends Light
{
    Radius: number

    constructor()
    constructor(light: IPointLight)
    constructor(light: IPointLight = { })
    {
        super(
            new Colour4(light.colour! ?? [255, 255, 255, 255]),
            !Number.isNaN(light.intensity) ? light.intensity! : 1
        )

        this.Radius = !Number.isNaN(light.radius) ? light.radius! : 5
    }
}
