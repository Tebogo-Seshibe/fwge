import { Colour3 } from "@fwge/common"
import { ILight, Light } from "./Light"

export interface ISpotLight extends ILight { }

export class SpotLight extends Light
{
    constructor()
    constructor(light: ISpotLight)
    constructor(light: ISpotLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as [number, number, number]),
            light.intensity
        )
    }
}
