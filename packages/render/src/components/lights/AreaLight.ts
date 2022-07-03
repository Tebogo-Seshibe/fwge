import { Colour4 } from "../../base"
import { Light } from "./Light"

export interface IAreaLight
{
    colour?: [number, number, number, number]
}

export class AreaLight extends Light
{
    constructor()
    constructor(light: IAreaLight)
    constructor(light: IAreaLight = { })
    {
        super(new Colour4(
            light.colour! ?? [255, 255, 255, 255]
        ))
    }
}
