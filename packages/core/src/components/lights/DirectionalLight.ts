import { clean, CubeGeometry, Matrix2, Matrix3, Matrix4, radian, Scalar, Vector3, Vector3Array } from "@fwge/common"
import { ColourType, DepthType, RenderTarget, Shader } from "../../base"
import { Camera, PerspectiveCamera } from "../camera"
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
        height: 2**13,
        width: 2**13
    })
    static readonly DefaultDirection: Vector3 = new Vector3(0, -1, 0)

    #viewVolume: CubeGeometry = new CubeGeometry()
    #direction: Vector3
    #castShadows: Scalar
    #texelSize: Scalar
    #texelCount: Scalar
    #bias: Scalar
    #pcfLevel: Scalar
    #shadowMatrix: Matrix4

    get Direction()
    {
        return this.#direction
    }
    
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
    }

    override Bind(shader: Shader)
    {
        let transform = this.Owner?.GetComponent(Transform)
        if (transform)
        {
            this.#direction.Set(
                // Matrix3.MultiplyVector(
                //     this.ViewMatrix.Matrix3,
                    DirectionalLight.DefaultDirection
                // )
            )
        }
        else
        {
            this.#direction.Set(DirectionalLight.DefaultDirection)
        }
        
        this.#shadowMatrix.Set(this.ShadowMatrix)
        if (this.CastShadows)
        {
            shader.SetTexture('U_Sampler.DirectionalShadow', this.RenderTarget.DepthAttachment!)
        }
        
        shader.SetFloatVector('U_DirectionalLight.Colour', this.Colour)
        shader.SetFloat('U_DirectionalLight.Intensity', this.Intensity)

        shader.SetFloatVector('U_DirectionalLight.Direction', this.#direction)
        shader.SetBool('U_DirectionalLight.CastShadows', this.CastShadows)

        shader.SetFloat('U_DirectionalLight.TexelSize', this.#texelSize)
        shader.SetFloat('U_DirectionalLight.TexelCount', this.#texelCount)
        shader.SetFloat('U_DirectionalLight.Bias', this.#bias)
        shader.SetFloat('U_DirectionalLight.PCFLevel', this.#pcfLevel)

        shader.SetMatrix('U_DirectionalLight.ShadowMatrix', this.#shadowMatrix)
        // super.Bind(shader)
    }
    
    BindForShadows(offset: Vector3 | Vector3Array = [0,0,0])
    { 
        this.RenderTarget.Bind()
        DirectionalLight.ShadowShader.Bind()
        DirectionalLight.ShadowShader.SetMatrix('U_Matrix.Shadow', this.ShadowMatrix.Multiply(Matrix4.TranslationMatrix(offset[0], 0, offset[2]).Transpose()))
    }

    UnbindForShadows()
    {
        DirectionalLight.ShadowShader.UnBind()
    }

    readonly ViewMatrix = Matrix4.OrthographicProjectionMatrix(100, 100, 100)

    get ModelMatrix(): Matrix4
    {
        const rotationMatrix = Matrix3.Identity

        const transform = this.Owner?.GetComponent(Transform)
        if (transform)
        {
            rotationMatrix.Multiply(Matrix3.RotationMatrix(transform.GlobalRotation()).Transpose())
        }

        return new Matrix4(rotationMatrix)
    }
    
    get ShadowMatrix(): Matrix4
    {    
        return Matrix4.Multiply(this.ViewMatrix, this.ModelMatrix)
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
                    mat4 Camera;
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
