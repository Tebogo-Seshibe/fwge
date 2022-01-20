import { Colour4 } from "../../atoms/colour"
import { Light } from "./Light"

interface IDiffuseLight
{
    colour?: Colour4
}

export class DiffuseLight extends Light
{
    constructor()
    constructor(light: IDiffuseLight)
    constructor(light: IDiffuseLight = { })
    {
        super(light.colour)
    }
}
