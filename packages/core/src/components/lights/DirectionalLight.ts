import { Matrix4, Scalar, Vector3, Vector3Array } from "@fwge/common"
import { DepthType, RenderTarget, Shader } from "../../base"
import { ILight, Light } from "./Light"

export interface IDirectionalLight extends ILight
{
    direction?: Vector3Array | Vector3
    castShadows?: boolean
    bias?: number
    pcfLevel?: number
    shadowResolution?: number
}

export class DirectionalLight extends Light
{
    readonly RenderTarget: RenderTarget = new RenderTarget(
    {
        colour: [],
        depth: DepthType.FLOAT32,
        height: 4096,
        width: 4096
    })
    readonly Direction: Vector3

    #castShadows: Scalar
    #texelSize: Scalar
    #texelCount: Scalar
    #bias: Scalar
    #pcfLevel: Scalar

    get CastShadows()
    {
        return this.#castShadows.Value === 0
    }
    set CastShadows(castShadows: boolean)
    {
        this.#castShadows.Value = castShadows ? 0 : 1
    }

    get Bias()
    {
        return this.#bias.Value
    }
    set Bias(bias: number)
    {
        this.#bias.Value = bias
    }

    get PCFLevel()
    {
        return this.#pcfLevel.Value
    }
    set PCFLevel(pcfLevel: number)
    {
        this.#pcfLevel.Value = pcfLevel
        this.#texelCount.Value = ((pcfLevel * 2) + 1) ** 2
        this.#texelSize.Value = 1 / this.RenderTarget.Width
    }

    constructor()
    constructor(light: IDirectionalLight)
    constructor(light: IDirectionalLight = { })
    {
        super(light.colour, light.intensity, new Float32Array(12))

        this.Direction = new Vector3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 4)
        this.#castShadows = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 7)
        this.#texelSize = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 8)
        this.#texelCount = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 9)
        this.#bias = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 10)
        this.#pcfLevel = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 11)

        this.Direction.Set(light.direction as Vector3Array ?? [0, -1, -1])
        this.CastShadows = light.castShadows ?? false
        this.Bias = light.bias ?? 0.005
        this.PCFLevel = light.pcfLevel ?? 2

        {
            `
                [Colour R]      [Colour G]      [Colour B]      [Intensity]
                [Direction X]   [Direction Y]   [Direction Z]   [Cast Shadows]
                [Texel Size]    [Texel Count]   [Bias]          [PCFLevel]
            `
        }

        console.log(this)
    }

    override Bind(shader: Shader)
    {           
        if (this.CastShadows)         
        {
            shader.SetMatrix('U_Matrix.DirectionalShadow', DirectionalLight.ShadowMatrix)
            shader.SetTexture('U_Sampler.DirectionalShadow', this.RenderTarget.DepthAttachment!)
        }
        
        super.Bind(shader)
    }
    
    BindForShadows()
    {
        this.RenderTarget.Bind()
        DirectionalLight.ShadowShader.Bind()
        DirectionalLight.ShadowShader.SetMatrix('U_Matrix.Shadow', DirectionalLight.ShadowMatrix)
    }

    UnbindForShadows()
    {
        DirectionalLight.ShadowShader.UnBind()
        this.RenderTarget.UnBind()
    }
    
    static get ShadowMatrix(): Matrix4
    {
        return Matrix4.Multiply(
            DirectionalLight.ShadowProjectionMatrix,
            DirectionalLight.ShadowModelViewMatrix
        )
    }

    static get ShadowProjectionMatrix(): Matrix4
    {
        return Matrix4.OrthographicProjection(
            [-45, -45, -45],
            [ 45,  45,  45],
            [ 90,  90]
        ).Transpose()
    }
    static get ShadowModelViewMatrix(): Matrix4
    {
        return Matrix4.TransformationMatrix(
            [   0,   0,   0],
            [  90,   0,   0],
            [   1,   1,   1]
        ).Inverse()
    }
    
    private static _shadowShader: Shader
    static get ShadowShader(): Shader
    {
        if (!DirectionalLight._shadowShader)
        {
            DirectionalLight._shadowShader = new Shader(
                `#version 300 es
                #pragma vscode_glsllint_stage: vert

                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 ModelView;
                    mat4 Shadow;
                };
                uniform Matrix U_Matrix;
                
                void main(void)
                {
                    gl_Position = U_Matrix.Shadow * U_Matrix.ModelView * vec4(A_Position, 1.0);
                }`,

                `#version 300 es
                #pragma vscode_glsllint_stage: frag

                void main(void)
                {
                    
                }`
            )
        }

        return DirectionalLight._shadowShader
    }
}
