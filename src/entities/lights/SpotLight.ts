import { Scene } from "../../ecs"
import { Colour4 } from "../../atoms/colour"
import { Light } from "./Light"

interface ISpotLight
{
    colour?: Colour4
}

export class SpotLight extends Light
{
    constructor(scene: Scene)
    constructor(scene: Scene, light: ISpotLight)
    constructor(scene: Scene, light: ISpotLight =
    {
        colour: new Colour4(1.0, 1.0, 1.0, 1.0)
    })
    {
        super(scene, light.colour!)
    }
}
