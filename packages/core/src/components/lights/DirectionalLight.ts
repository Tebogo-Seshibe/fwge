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

    private readonly _viewVolume: CubeGeometry = new CubeGeometry();
    private readonly _direction: Vector3;
    private readonly _castShadows: Scalar;
    private readonly _texelSize: Scalar;
    private readonly _texelCount: Scalar;
    private readonly _bias: Scalar;
    private readonly _pcfLevel: Scalar;
    private readonly _shadowMatrix: Matrix4;

    get Direction()
    {
        return this._direction;
    }

    get CastShadows()
    {
        return this._castShadows.Value === 0;
    }
    set CastShadows(castShadows: boolean)
    {
        this._castShadows.Value = castShadows ? 0 : 1;
    }

    get Bias()
    {
        return this._bias.Value;
    }
    set Bias(bias: number)
    {
        this._bias.Value = bias;
    }

    get PCFLevel()
    {
        return this._pcfLevel.Value as PCFLevelType;
    }
    set PCFLevel(pcfLevel: PCFLevelType)
    {
        this._pcfLevel.Value = pcfLevel;
        this._texelCount.Value = ((pcfLevel * 2) + 1) ** 2;
        this._texelSize.Value = 1 / this.RenderTarget.Width;
    }

    constructor();
    constructor(light: IDirectionalLight);
    constructor(light: IDirectionalLight = {})
    {
        super(light.colour, light.intensity, new Float32Array(28));

        this._direction = new Vector3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 4);
        this._castShadows = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 7);
        this._texelSize = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 8);
        this._texelCount = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 9);
        this._bias = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 10);
        this._pcfLevel = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 11);
        this._shadowMatrix = new Matrix4(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 12);

        this._direction.Set(DirectionalLight.DefaultDirection);
        this.CastShadows = light.castShadows ?? true;
        this.Bias = light.bias ?? 0.025;
        this.PCFLevel = light.pcfLevel ?? 2;
        this._shadowMatrix.Identity();

        {
            `
                [Colour R]      [Colour G]      [Colour B]      [Intensity]
                [Direction X]   [Direction Y]   [Direction Z]   [Cast Shadows]
                [Texel Size]    [Texel Count]   [Bias]          [PCFLevel]
            `;
        }

        this.ShadowCascades = (light.cascades ?? [
            // {
            //     dimensions: [10, 10, 10],
            //     resolution: [1024, 1024],
            //     near: 0,
            //     far: 10
            // },
            // {
            //     dimensions: [25, 25, 25],
            //     resolution: [1024, 1024],
            //     near: 10,
            //     far: 25
            // },
            {
                dimensions: [50, 50, 50],
                resolution: [1024, 1024],
                near: 25,
                far: 50,
            }
        ]).map(config => new ShadowCascade(config)) as [ShadowCascade, ShadowCascade, ShadowCascade];
    }

    override Bind(shader: Shader)
    {
        let transform = this.Owner?.GetComponent(Transform);
        if (transform)
        {
            this._direction.Set(
                // Matrix3.MultiplyVector(
                //     this.ViewMatrix.Matrix3,
                DirectionalLight.DefaultDirection
                // )
            );
        }
        else
        {
            this._direction.Set(DirectionalLight.DefaultDirection);
        }

        this._shadowMatrix.Set(this.ShadowMatrix);
        if (this.CastShadows)
        {
            shader.SetTexture('U_Sampler.DirectionalShadow', this.RenderTarget.DepthAttachment!);
        }

        shader.SetFloatVector('U_DirectionalLight.Colour', this.Colour);
        shader.SetFloat('U_DirectionalLight.Intensity', this.Intensity);

        shader.SetFloatVector('U_DirectionalLight.Direction', this._direction);
        shader.SetBool('U_DirectionalLight.CastShadows', this.CastShadows);

        shader.SetFloat('U_DirectionalLight.TexelSize', this._texelSize);
        shader.SetFloat('U_DirectionalLight.TexelCount', this._texelCount);
        shader.SetFloat('U_DirectionalLight.Bias', this._bias);
        shader.SetFloat('U_DirectionalLight.PCFLevel', this._pcfLevel);
        shader.SetMatrix('U_DirectionalLight.ShadowMatrix', this._shadowMatrix);
        // super.Bind(shader)
    }
    
    BindBlock(shader: Shader): void
    BindBlock(shader: Shader, block: string): void
    BindBlock(shader: Shader, block: string, offset: number): void
    BindBlock(shader: Shader, block: string, push: boolean): void
    BindBlock(shader: Shader, block: string, push: boolean, offset: number): void
    BindBlock(shader: Shader, block = 'DirectionalLight', push_offset: number | boolean = true, offset: number = 0): void
    {
        const push = typeof push_offset === 'number'
            ? true
            : push_offset
        offset = typeof push_offset === 'number'
            ? push_offset
            : offset
            
        shader.SetBufferDataField(block, 'Colour', this.Colour, offset);
        shader.SetBufferDataField(block, 'Intensity', this.Intensity, offset);
        shader.SetBufferDataField(block, 'Direction', this.Direction, offset);
        shader.SetBufferDataField(block, 'CastShadows', this.CastShadows ? 1 : 0, offset);
        shader.SetBufferDataField(block, 'TexelSize', this._texelSize, offset);
        shader.SetBufferDataField(block, 'TexelCount', this._texelCount, offset);
        shader.SetBufferDataField(block, 'Bias', this.Bias, offset);
        shader.SetBufferDataField(block, 'PCFLevel', this.PCFLevel, offset);
        shader.SetBufferDataField(block, 'ShadowMatrix', this.ShadowMatrix, offset);

        if (push)
        {
            shader.PushBufferData(block);
        }
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

        return Matrix4.RotationMatrix(rotx - 90, roty, rotz);
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

    static _shadowShader: Shader;
    static get ShadowShader(): Shader
    {
        if (!DirectionalLight._shadowShader)
        {
            DirectionalLight._shadowShader = new Shader
                (
                    `#version 300 es
                #pragma vscode_glsllint_stage: vert
                precision highp float;

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
                precision highp float;

                void main(void)
                {
                }`
                );
        }

        return DirectionalLight._shadowShader;
    }

}
