import { Colour4, Vector3 } from "@fwge/common"
import { Light } from "./Light"

export interface IDirectionalLight
{
    colour?: [number, number, number, number]
    direction?: [number, number, number]
    intensity?: number
}

export class DirectionalLight extends Light
{
    public readonly Direction: Vector3

    constructor()
    constructor(light: IDirectionalLight)
    constructor(light: IDirectionalLight = { })
    {
        super(
            new Colour4(light.colour! ?? [1, 1, 1, 1]),
            light.intensity
        )

        this.Direction = new Vector3(
            light.direction ?? [0,-1,-1]
        ).Normalize()
    }
}
