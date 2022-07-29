import { Colour3, Vector3 } from "@fwge/common"
import { DepthType, RenderTarget } from "../../base"
import { ILight, Light } from "./Light"

export interface IDirectionalLight extends ILight
{
    direction?: [number, number, number] | Vector3
}

export class DirectionalLight extends Light
{
    readonly renderTarget: RenderTarget = new RenderTarget(
    {
        colour: [],
        depth: DepthType.FLOAT32,
        height: 2048,
        width: 2048
    })
    readonly Direction: Vector3

    constructor()
    constructor(light: IDirectionalLight)
    constructor(light: IDirectionalLight = { })
    {
        super(
            light.ambient && new Colour3(light.ambient as [number, number, number]),
            light.diffuse && new Colour3(light.diffuse as [number, number, number]),
            light.specular && new Colour3(light.specular as [number, number, number]),
            light.intensity
        )

        this.Direction = Vector3.Normalize(light.direction as [number, number, number] ?? [0,-1,-1])
    }
}
