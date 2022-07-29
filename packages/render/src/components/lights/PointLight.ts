import { Colour3 } from "@fwge/common"
import { ILight, Light } from "./Light"

export interface IPointLight extends ILight
{
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
            light.ambient && new Colour3(light.ambient as [number, number, number]),
            light.diffuse && new Colour3(light.diffuse as [number, number, number]),
            light.specular && new Colour3(light.specular as [number, number, number]),
            light.intensity
        )

        this.Radius = light.radius ?? 5
    }
}
