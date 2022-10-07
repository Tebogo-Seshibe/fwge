import { Colour3, Scalar, Vector3, Vector3Array } from "@fwge/common"
import { DepthType, RenderTarget, Shader } from "../../base"
import { Camera, PerspectiveCamera } from "../camera"
import { Transform } from "../Transform"
import { ILight, Light } from "./Light"

export interface IPointLight extends ILight
{
    radius?: number
    castShadows?: boolean
}

export class PointLight extends Light
{
    #radius: Scalar
    get Radius(): number
    {
        return this.#radius.Value
    }
    set Radius(value: number)
    {
        this.#radius.Value = value
    }
    CastShadows: boolean

    // readonly ShadowCubeMap: RenderTarget = new RenderTarget({
    //   colour: [],
    //   depth: DepthType.INT24,
    //   height: 1024,
    //   width: 1024  
    // })

    constructor()
    constructor(light: IPointLight)
    constructor(light: IPointLight = { })
    {
        super(light.colour, light.intensity, new Float32Array(8))
        this.#radius = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 7)

        this.Radius = light.radius ?? 5
        this.CastShadows = light.castShadows ?? false
        
        {
            `
                [R] [G] [B] [intensity]
                [X] [Y] [Z] [radius]
            `
        }
    }

    override Bind(shader: Shader, index?: number): void
    {
        this.BufferData.set(this.Owner?.GetComponent(Transform)?.GlobalPosition() ?? Vector3.Zero, 4)
        super.Bind(shader)
    }

    static ShadowMapCamera: Camera = new PerspectiveCamera(
    {
        fieldOfView: 90,
        nearClipping: 0.1,
        farClipping: 1000,
        aspectRatio: 1.0
    })
}
