import { Colour4 } from "../../base"
import { Light } from "./Light"

interface ISpotLight
{
    colour?: Colour4
}

export class SpotLight extends Light
{
    constructor()
    constructor(light: ISpotLight)
    constructor(light: ISpotLight = { })
    {
        super(light.colour)
    }
}