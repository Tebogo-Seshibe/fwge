import { Colour4 } from "../../base"
import { Light } from "./Light"

export interface ISpotLight
{
    colour?: [number, number, number, number]
}

export class SpotLight extends Light
{
    constructor()
    constructor(light: ISpotLight)
    constructor(light: ISpotLight = { })
    {
        super(new Colour4(
            light.colour! ?? [255, 255, 255, 255]
        ))
    }
}
