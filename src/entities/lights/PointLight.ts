import { Scene } from "../../ecs"
import { Colour4 } from "../../atoms/colour"
import { Light } from "./Light"

interface IPointLight
{
    colour?: Colour4
}

export class PointLight extends Light
{
    constructor(scene: Scene)
    constructor(scene: Scene, light: IPointLight)
    constructor(scene: Scene, light: IPointLight =
    {
        colour:  new Colour4(1.0, 1.0, 1.0, 1.0)
    })
    {
        super(scene, light.colour!)
    }
}
