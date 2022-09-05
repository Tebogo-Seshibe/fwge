import { Colour3, Vector3Array } from "@fwge/common"
import { Shader } from "../../base"
import { Transform } from "../Transform"
import { ILight, Light } from "./Light"

export interface IPointLight extends ILight
{
    radius?: number
    castShadows?: boolean
}

export class PointLight extends Light
{
    Radius: number
    CastShadows: boolean

    constructor()
    constructor(light: IPointLight)
    constructor(light: IPointLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as Vector3Array),
            light.intensity
        )

        this.Radius = light.radius ?? 5
        this.CastShadows = light.castShadows ?? false
    }

    override Bind(shader: Shader, index?: number): void
    {
        shader.SetFloatVector(`U_PointLight[${index!}].Colour`, this.Colour)
        shader.SetFloat(`U_PointLight[${index!}].Intensity`, this.Intensity)
        shader.SetFloat(`U_PointLight[${index!}].Radius`, this.Radius)
        shader.SetFloatVector(`U_PointLight[${index!}].Position`, this.Owner!.GetComponent(Transform)!.GlobalPosition())
    }
}
