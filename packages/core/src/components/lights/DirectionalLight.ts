import { Colour3, Vector3 } from "@fwge/common"
import { DepthType, RenderTarget, Shader } from "../../base"
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
            light.colour && new Colour3(light.colour as [number, number, number]),
            light.intensity
        )

        this.Direction = Vector3.Normalize(light.direction as [number, number, number] ?? [0,-1,-1])
    }

    override Bind(shader: Shader, index?: number): void
    {
        shader.SetFloatVector(`U_DirectionalLight.Colour`, this.Colour)
        shader.SetFloat(`U_DirectionalLight.Intensity`, this.Intensity)
        shader.SetFloatVector(`U_DirectionalLight.Direction`, Vector3.Negate(this.Direction).Normalize())
    }
}
