import { Colour3 } from "@fwge/common"
import { Image3D, Shader } from "../../base"
import { ILight, Light } from "./Light"

export interface IAreaLight extends ILight { }

export class AreaLight extends Light
{
    // SkyMap: Image3D | null = null

    constructor()
    constructor(light: IAreaLight)
    constructor(light: IAreaLight = { })
    {
        super(
            light.colour && new Colour3(light.colour as [number, number, number]),
            light.intensity
        )
        console.log(this)
    }

    override Bind(shader: Shader): void
    {
        shader.SetFloat('U_AreaLight.Intensity', this.Intensity)

        // if (this.SkyMap)
        // {
        //     shader.SetBool('U_AmbientLight.HasColourMap', true)
        //     shader.SetTexture(15, 'U_AmbientLight.ColourMap', this.SkyMap.Texture)
        // }
        // else
        {
            shader.SetBool('U_AreaLight.HasColourMap', false)
            shader.SetFloatVector('U_AreaLight.Colour', this.Colour)
        }
    }
}
