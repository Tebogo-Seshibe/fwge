import { Vector3 } from "@fwge/common"
import { Colour4 } from "../../base"
import { Light } from "./Light"

export interface IDirectionalLight
{
    colour?: [number, number, number, number]
    direction?: [number, number, number]
}

export class DirectionalLight extends Light
{
    public readonly Direction: Vector3

    constructor()
    constructor(light: IDirectionalLight)
    constructor(light: IDirectionalLight = { })
    {
        super(new Colour4(
            light.colour! ?? [255, 255, 255, 255]
        ))

        this.Direction = new Vector3(
            light.direction ?? [0,-1,0]
        )
    }
}
