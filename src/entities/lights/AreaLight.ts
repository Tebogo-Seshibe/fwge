import { Scene } from "ecs/"
import { Colour4 } from "../../atoms/colour"
import { Light } from "./Light"

interface IAreaLight
{
    colour?: Colour4
}

export class AreaLight extends Light
{
    constructor(scene: Scene)
    constructor(scene: Scene, light: IAreaLight)
    constructor(scene: Scene, light: IAreaLight =
    {
        colour:  new Colour4(1.0, 1.0, 1.0, 1.0)
    })
    {
        super(scene, light.colour!)
    }
}
