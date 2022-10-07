import { clean, Matrix3, Matrix4, Scalar, Vector3, Vector3Array } from "@fwge/common"
import { ColourType, DepthType, RenderTarget, Shader } from "../../base"
import { Transform } from "../Transform"
import { ILight, Light } from "./Light"

export type PCFLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 
export interface IDirectionalLight extends ILight
{
    direction?: Vector3Array | Vector3
    castShadows?: boolean
    bias?: number
    pcfLevel?: PCFLevelType
    shadowResolution?: number
}

export class DirectionalLight extends Light
{
    readonly RenderTarget: RenderTarget = new RenderTarget(
    {
        colour: [],
        depth: DepthType.FLOAT32,
        height: 2**11,
        width: 2**11
    })
    static readonly DefaultDirection: Vector3 = new Vector3(0, -1, 0)

    #direction: Vector3
    #castShadows: Scalar
    #texelSize: Scalar
    #texelCount: Scalar
    #bias: Scalar
    #pcfLevel: Scalar
    #shadowMatrix: Matrix4

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
        return this.#pcfLevel.Value as PCFLevelType
    }
    set PCFLevel(pcfLevel: PCFLevelType)
    {
        this.#pcfLevel.Value = pcfLevel
        this.#texelCount.Value = ((pcfLevel * 2) + 1) ** 2
        this.#texelSize.Value = 1 / this.RenderTarget.Width
    }

    constructor()
    constructor(light: IDirectionalLight)
    constructor(light: IDirectionalLight = { })
    {
        super(light.colour, light.intensity, new Float32Array(28))

        this.#direction = new Vector3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 4)
        this.#castShadows = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 7)
        this.#texelSize = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 8)
        this.#texelCount = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 9)
        this.#bias = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 10)
        this.#pcfLevel = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 11)
        this.#shadowMatrix = new Matrix4(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 12)

        this.#direction.Set(DirectionalLight.DefaultDirection)
        this.CastShadows = light.castShadows ?? false
        this.Bias = light.bias ?? 0.005
        this.PCFLevel = light.pcfLevel ?? 2
        this.#shadowMatrix.Identity()

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
        const shadowMatrix = Matrix4.OrthographicProjection([-45, -45, -45], [ 45,  45,  45], [ 90,  90]).Transpose()
        let transform = this.Owner?.GetComponent(Transform)
        if (transform)
        {
            const rotationMatrix = Matrix3.RotationMatrix(transform.Rotation).Transpose()

            Matrix3.MultiplyVector(
                rotationMatrix,
                DirectionalLight.DefaultDirection,
                this.#direction
            )

            Matrix4.Multiply(shadowMatrix, new Matrix4(rotationMatrix), shadowMatrix)
        }
        else
        {
            this.#direction.Set(DirectionalLight.DefaultDirection)
        }
        
        this.#shadowMatrix.Set(shadowMatrix)
        if (this.CastShadows)         
        {
            shader.SetTexture('U_Sampler.DirectionalShadow', this.RenderTarget.DepthAttachment!)
        }
        
        super.Bind(shader)
    }
    
    BindForShadows()
    {
        this.RenderTarget.Bind()
        DirectionalLight.ShadowShader.Bind()

        const shadowMatrix = Matrix4.OrthographicProjection(
            [-45, -45, -45],
            [ 45,  45,  45],
            [ 90,  90]
        ).Transpose()
        let transform = this.Owner?.GetComponent(Transform)
        if (transform)
        {
            const rotationMatrix = Matrix3.RotationMatrix(transform.Rotation).Inverse()
            Matrix4.Multiply(shadowMatrix, new Matrix4(rotationMatrix), shadowMatrix)
        }

        DirectionalLight.ShadowShader.SetMatrix('U_Matrix.Shadow', shadowMatrix)
    }

    UnbindForShadows()
    {
        DirectionalLight.ShadowShader.UnBind()
        this.RenderTarget.UnBind()
    }

    static #shadowShader: Shader
    static get ShadowShader(): Shader
    {
        if (!DirectionalLight.#shadowShader)
        {
            DirectionalLight.#shadowShader = new Shader
            (
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

        return DirectionalLight.#shadowShader
    }
}
