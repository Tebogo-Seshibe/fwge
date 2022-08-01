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
            light.colour && new Colour3(light.colour as [number, number, number]),
            light.intensity
        )
    }
}
