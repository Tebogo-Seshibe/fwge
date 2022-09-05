import { Colour3, Vector3, Vector3Array } from "@fwge/common"
import { DepthType, RenderTarget, Shader } from "../../base"
import { ILight, Light } from "./Light"

export interface IDirectionalLight extends ILight
{
    direction?: Vector3Array | Vector3
    castShadows?: boolean
}

export class DirectionalLight extends Light
{
    readonly RenderTarget: RenderTarget = new RenderTarget(
    {
        colour: [],
        depth: DepthType.FLOAT32,
        height: 2048,
        width: 2048
    })
    readonly Direction: Vector3
    CastShadows: boolean

    constructor()
    constructor(light: IDirectionalLight)
    constructor(light: IDirectionalLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as Vector3Array),
            light.intensity
        )

        this.Direction = Vector3.Normalize(light.direction as Vector3Array ?? [0,-1,-1])
        this.CastShadows = light.castShadows ?? false
    }

    override Bind(shader: Shader, index?: number): void
    {
        shader.SetFloatVector('U_DirectionalLight.Colour', this.Colour)
        shader.SetFloat('U_DirectionalLight.Intensity', this.Intensity)
        shader.SetFloatVector('U_DirectionalLight.Direction', Vector3.Negate(this.Direction).Normalize())
    }
}
