import { Vector3 } from "@fwge/common"
import { Colour4 } from "../../base"
import { Light } from "./Light"

interface IPointLight
{
    colour?: Colour4
}

export class PointLight extends Light
{
    Intensity: number = 1
    Position: Vector3 = Vector3.ZERO
    Radius: number = 1
    Angle: number = 180

    constructor()
    constructor(light: IPointLight)
    constructor(light: IPointLight = { })
    {
        super(light.colour)
    }
}
