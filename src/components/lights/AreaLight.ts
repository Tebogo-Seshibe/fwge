import { Colour4 } from "../../atoms/colour"
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
