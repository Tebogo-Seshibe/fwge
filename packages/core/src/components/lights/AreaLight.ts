import { Colour3, Vector3Array } from "@fwge/common"
import { Image3D, Shader } from "../../base"
import { ILight, Light } from "./Light"

export interface IAreaLight extends ILight { }

export class AreaLight extends Light
{
    public SkyMap: Image3D | null = null

    constructor()
    constructor(light: IAreaLight)
    constructor(light: IAreaLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as Vector3Array),
            light.intensity
        )
    }

    override Bind(shader: Shader): void
    {
        shader.SetFloat('U_AreaLight.Intensity', this.Intensity)
        shader.SetFloatVector('U_AreaLight.Colour', this.Colour)

        if (this.SkyMap)
        {
            shader.SetBool('U_AmbientLight.HasColourMap', true)
            shader.SetTexture('U_AmbientLight.ColourMap', this.SkyMap.Texture)
        }
        else
        {
            shader.SetBool('U_AreaLight.HasColourMap', false)
        }
    }
}
