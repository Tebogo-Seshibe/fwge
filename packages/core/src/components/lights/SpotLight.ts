import { Colour3, Vector3, Vector3Array } from "@fwge/common"
import { Shader } from "../../base"
import { Transform } from "../Transform"
import { ILight, Light } from "./Light"

export interface ISpotLight extends ILight
{
    angle?: number
    direction?: Vector3 | Vector3Array
    castShadows?: boolean
}

export class SpotLight extends Light
{
    Angle: number
    readonly Direction: Vector3
    CastShadows: boolean

    constructor()
    constructor(light: ISpotLight)
    constructor(light: ISpotLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as Vector3Array),
            light.intensity
        )

        this.Angle = light.angle ?? 15
        this.Direction = light.direction ? new Vector3(light.direction) : new Vector3(0, -1, 0)
        this.CastShadows = light.castShadows ?? false
    }

    override Bind(shader: Shader, index?: number): void
    {
        shader.SetFloatVector(`U_SpotLight[${index!}].Colour`, this.Colour)
        shader.SetFloat(`U_SpotLight[${index!}].Intensity`, this.Intensity)
        shader.SetFloat(`U_SpotLight[${index!}].Angle`, this.Angle)
        shader.SetFloatVector(`U_SpotLight[${index!}].Position`, this.Owner!.GetComponent(Transform)!.GlobalPosition())
        shader.SetFloatVector(`U_SpotLight[${index!}].Direction`, this.Direction)
    }
}
