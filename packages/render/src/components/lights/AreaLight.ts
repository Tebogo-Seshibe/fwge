import { Colour3 } from "@fwge/common"
import { ILight, Light } from "./Light"

export interface IAreaLight extends ILight { }

export class AreaLight extends Light
{
    constructor()
    constructor(light: IAreaLight)
    constructor(light: IAreaLight = { })
    {
        super(
            light.ambient && new Colour3(light.ambient as [number, number, number]),
            light.diffuse && new Colour3(light.diffuse as [number, number, number]),
            light.specular && new Colour3(light.specular as [number, number, number]),
            light.intensity
        )
    }
}
