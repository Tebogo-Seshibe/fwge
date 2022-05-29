import { Colour4 } from "../../base"
import { Light } from "./Light"

interface IAreaLight
{
    colour?: Colour4
}

export class AreaLight extends Light
{
    constructor()
    constructor(light: IAreaLight)
    constructor(light: IAreaLight = { })
    {
        super(light.colour)
    }
}
