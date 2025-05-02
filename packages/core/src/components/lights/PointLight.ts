import { Scalar } from "@fwge/common";
import { Shader } from "../../base";
import { Light, LightArgs } from "./Light";

export interface PointLightArgs extends LightArgs
{
    radius?: number
    castShadows?: boolean
}

export class PointLight extends Light
{
    private _radius: Scalar
    get Radius(): number
    {
        return this._radius.Value
    }
    set Radius(value: number)
    {
        this._radius.Value = value
    }
    CastShadows: boolean

    // readonly ShadowCubeMap: RenderTarget = new RenderTarget({
    //   colour: [],
    //   depth: DepthType.INT24,
    //   height: 1024,
    //   width: 1024  
    // })

    constructor()
    constructor(light: PointLightArgs)
    constructor(light: PointLightArgs = { })
    {
        super(light.colour, light.intensity, new Float32Array(8))
        this._radius = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 7)

        this.Radius = light.radius ?? 5
        this.CastShadows = light.castShadows ?? false
        
        {
            `
                [R] [G] [B] [intensity]
                [X] [Y] [Z] [radius]
            `
        }
    }

    override Bind(shader: Shader, index: number): void
    {
        // const position = this.Owner?.GetComponent(Transform)?.GlobalPosition() ?? Vector3.Zero
        // this.BufferData.set(position, 4)
        
        // shader.SetFloatVector('U_PointLight.Colour', this.Colour)
        // shader.SetFloat('U_PointLight.Intensity', this.Intensity)

        // shader.SetFloatVector('U_PointLight.Position', position)
        // shader.SetFloat('U_PointLight.Radius', this.#radius)
        // super.Bind(shader)
    }

    // static ShadowMapCamera: Camera = new PerspectiveCamera(
    // {
    //     fieldOfView: 90,
    //     nearClipping: 0.1,
    //     farClipping: 1000,
    //     aspectRatio: 1.0
    // })
}
