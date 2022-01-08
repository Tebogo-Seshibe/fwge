import { Scene } from "ecs"
import { Colour4 } from "atoms/colour"
import { Light } from "./Light"

interface IDiffuseLight
{
    colour?: Colour4
}

export class DiffuseLight extends Light
{
    constructor(scene: Scene)
    constructor(scene: Scene, light: IDiffuseLight)
    constructor(scene: Scene, light: IDiffuseLight =
    {
        colour:  new Colour4(1.0, 1.0, 1.0, 1.0)
    })
    {
        super(scene, light.colour!)
    }
}
