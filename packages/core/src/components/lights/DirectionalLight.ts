import { CubeGeometry, Matrix4, Scalar, Vector2, Vector2Array, Vector3, Vector3Array } from "@fwge/common";
import { ColourType, DepthType, RenderTarget, Shader } from "../../base";
import { Transform } from "../Transform";
import { ILight, Light } from "./Light";

export type PCFLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export interface IDirectionalLight extends ILight
{
    direction?: Vector3Array | Vector3;
    castShadows?: boolean;
    bias?: number;
    pcfLevel?: PCFLevelType;
    shadowResolution?: number;
    cascades?: [IShadowCascade, IShadowCascade, IShadowCascade];
}

export interface IShadowCascade
{
    dimensions: Vector3 | Vector3Array;
    resolution: Vector2 | Vector2Array;

    near: number;
    far: number;
}

export class ShadowCascade
{
    private _dimensions: Vector3 = Vector3.Zero;
    private _resolution: Vector2 = Vector2.Zero;
    private _projection: Matrix4 = Matrix4.Identity;
    private _renderTarget: RenderTarget = new RenderTarget(
        {
            colour: [ColourType.FLOAT_RGB],
            depth: DepthType.INT24,
            height: 2 ** 13,
            width: 2 ** 13,
            clear: [1, 1, 1, 1]
        });

    get Width(): number
    {
        return this._dimensions[0];
    }
    set Width(width: number)
    {
        this._dimensions[0] = width;
        this._projection.M11 = 2 / width;
    }

    get Height(): number
    {
        return this._dimensions[1];
    }
    set Height(height: number)
    {
        this._dimensions[1] = height;
        this._projection.M22 = 2 / height;
    }

    get Depth(): number
    {
        return this._dimensions[2];
    }
    set Depth(depth: number)
    {
        this._dimensions[2] = depth;
        this._projection.M33 = 2 / depth;
    }

    get ResolutionX(): number
    {
        return this._resolution[0];
    }
    set ResolutionX(x: number)
    {
        this._resolution[0] = x;
        this._renderTarget = new RenderTarget(
            {
                colour: [],
                depth: DepthType.INT24,
                width: x,
                height: this._resolution[1],
            });
    }

    get ResolutionY(): number
    {
        return this._resolution[1];
    }
    set ResolutionY(y: number)
    {
        this._resolution[1] = y;
        this._renderTarget = new RenderTarget(
            {
                colour: [],
                depth: DepthType.INT24,
                width: this._resolution[0],
                height: y,
            });
    }

    get Projection(): Matrix4
    {
        return this._projection;
    }

    get RenderTarget(): RenderTarget
    {
        return this._renderTarget;
    }

    constructor(config: IShadowCascade)
    {
        this._dimensions = new Vector3(config.dimensions as Vector3Array);
        this._resolution = new Vector2(config.resolution as Vector2Array);
        // this._projection = Matrix4.OrthographicProjectionMatrix(
        //     this._dimensions[0],
        //     this._dimensions[1],
        //     this._dimensions[2]
        // )

        const x = this._dimensions.X / 2;
        const y = this._dimensions.Y / 2;

        this._projection = Matrix4.OrthographicProjection(
            [-x, -y, config.near],
            [x, y, config.far],
            [90, 90]
        );
    }
}

export class DirectionalLight extends Light
{
    readonly RenderTarget: RenderTarget = new RenderTarget(
        {
            colour: [],
            depth: DepthType.INT24,
            height: 2 ** 13,
            width: 2 ** 13
        });
    static readonly DefaultDirection: Vector3 = new Vector3(0, -1, 0);

    readonly ShadowCascades: [ShadowCascade, ShadowCascade, ShadowCascade];

    #viewVolume: CubeGeometry = new CubeGeometry();
    #direction: Vector3;
    #castShadows: Scalar;
    #texelSize: Scalar;
    #texelCount: Scalar;
    #bias: Scalar;
    #pcfLevel: Scalar;
    #shadowMatrix: Matrix4;

    get Direction()
    {
        return this.#direction;
    }

    get CastShadows()
    {
        return this.#castShadows.Value === 0;
    }
    set CastShadows(castShadows: boolean)
    {
        this.#castShadows.Value = castShadows ? 0 : 1;
    }

    get Bias()
    {
        return this.#bias.Value;
    }
    set Bias(bias: number)
    {
        this.#bias.Value = bias;
    }

    get PCFLevel()
    {
        return this.#pcfLevel.Value as PCFLevelType;
    }
    set PCFLevel(pcfLevel: PCFLevelType)
    {
        this.#pcfLevel.Value = pcfLevel;
        this.#texelCount.Value = ((pcfLevel * 2) + 1) ** 2;
        this.#texelSize.Value = 1 / this.RenderTarget.Width;
    }

    constructor();
    constructor(light: IDirectionalLight);
    constructor(light: IDirectionalLight = {})
    {
        super(light.colour, light.intensity, new Float32Array(28));

        this.#direction = new Vector3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 4);
        this.#castShadows = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 7);
        this.#texelSize = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 8);
        this.#texelCount = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 9);
        this.#bias = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 10);
        this.#pcfLevel = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 11);
        this.#shadowMatrix = new Matrix4(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 12);

        this.#direction.Set(DirectionalLight.DefaultDirection);
        this.CastShadows = light.castShadows ?? true;
        this.Bias = light.bias ?? 0.025;
        this.PCFLevel = light.pcfLevel ?? 2;
        this.#shadowMatrix.Identity();

        {
            `
                [Colour R]      [Colour G]      [Colour B]      [Intensity]
                [Direction X]   [Direction Y]   [Direction Z]   [Cast Shadows]
                [Texel Size]    [Texel Count]   [Bias]          [PCFLevel]
            `;
        }

        this.ShadowCascades = (light.cascades ?? [
            {
                dimensions: [10, 10, 10],
                resolution: [1024, 1024],
                near: 0,
                far: 10
            },
            {
                dimensions: [25, 25, 25],
                resolution: [1024, 1024],
                near: 10,
                far: 25
            },
            {
                dimensions: [50, 50, 50],
                resolution: [1024, 1024],
                near: 25,
                far: 50
            }
        ]).map(config => new ShadowCascade(config)) as [ShadowCascade, ShadowCascade, ShadowCascade];

        console.log(this);
    }

    override Bind(shader: Shader)
    {
        let transform = this.Owner?.GetComponent(Transform);
        if (transform)
        {
            this.#direction.Set(
                // Matrix3.MultiplyVector(
                //     this.ViewMatrix.Matrix3,
                DirectionalLight.DefaultDirection
                // )
            );
        }
        else
        {
            this.#direction.Set(DirectionalLight.DefaultDirection);
        }

        this.#shadowMatrix.Set(this.ShadowMatrix);
        if (this.CastShadows)
        {
            shader.SetTexture('U_Sampler.DirectionalShadow', this.RenderTarget.DepthAttachment!);
        }

        shader.SetFloatVector('U_DirectionalLight.Colour', this.Colour);
        shader.SetFloat('U_DirectionalLight.Intensity', this.Intensity);

        shader.SetFloatVector('U_DirectionalLight.Direction', this.#direction);
        shader.SetBool('U_DirectionalLight.CastShadows', this.CastShadows);

        shader.SetFloat('U_DirectionalLight.TexelSize', this.#texelSize);
        shader.SetFloat('U_DirectionalLight.TexelCount', this.#texelCount);
        shader.SetFloat('U_DirectionalLight.Bias', this.#bias);
        shader.SetFloat('U_DirectionalLight.PCFLevel', this.#pcfLevel);

        shader.SetMatrix('U_DirectionalLight.ShadowMatrix', this.#shadowMatrix);
        // super.Bind(shader)
    }

    BindForShadows(offset: Vector3 | Vector3Array = [0, 0, 0])
    {
        this.RenderTarget.Bind();
        DirectionalLight.ShadowShader.Bind();
        DirectionalLight.ShadowShader.SetMatrix('U_Matrix.Shadow', this.ShadowMatrix);
    }

    UnbindForShadows()
    {
        DirectionalLight.ShadowShader.UnBind();
    }

    readonly ViewMatrix = Matrix4.OrthographicProjection(-10, -10, -10, 10, 10, 10, 90, 90);

    get ModelMatrix(): Matrix4
    {
        const transform = this.Owner?.GetComponent(Transform);
        const rotx = transform?.GlobalRotation().X ?? 0;
        const roty = transform?.GlobalRotation().Y ?? 0;
        const rotz = transform?.GlobalRotation().Z ?? 0;

        return Matrix4.RotationMatrix(rotx + 90, roty, rotz).Transpose();
        // const rot = Matrix4.RotationMatrix(rotx + 90, roty, rotz)
        // const pos = Matrix4.TranslationMatrix(1, 0, 0)
        // return Matrix4.Multiply(rot, pos).Inverse()
        // return Matrix4.TransformationMatrix(
        //     [0, 0, 0],
        //     [rotx, roty, rotz],
        //     [1, 1, 1]
        // ).Inverse()
    }

    get ShadowMatrix(): Matrix4
    {
        return Matrix4.Multiply(this.ViewMatrix, this.ModelMatrix);
    }

    static #shadowShader: Shader;
    static get ShadowShader(): Shader
    {
        if (!DirectionalLight.#shadowShader)
        {
            DirectionalLight.#shadowShader = new Shader
                (
                    `#version 300 es
                #pragma vscode_glsllint_stage: vert
                precision highp float;

                layout(location = 0) in vec3 A_Position;
                out vec4 cascade;

                struct Matrix
                {
                    mat4 ModelView;
                    mat4 Shadow;
                    mat4 Camera;
                };
                uniform Matrix U_Matrix;
                
                void main(void)
                {
                    cascade = U_Matrix.Shadow * U_Matrix.ModelView * vec4(A_Position, 1.0);
                    gl_Position = vec4(0.0,0.0,0.0,1.0);
                }`,

                    `#version 300 es
                #pragma vscode_glsllint_stage: frag
                precision highp float;

                in vec4 cascade;
                layout(location = 0) out vec3 O_FragDepth;

                void main(void)
                {
                    O_FragDepth.r = ((cascade.z / cascade.w) + 1.0) * 0.5;
                }`
                );
        }

        return DirectionalLight.#shadowShader;
    }

}
