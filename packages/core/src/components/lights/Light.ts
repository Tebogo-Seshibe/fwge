import { Colour3, Colour3Array, IsBindable, Scalar, Vector3, Vector3Array } from "@fwge/common";
import { Component } from "@fwge/ecs";
import { Shader } from "../../base";

export interface LightArgs
{
    colour?: Colour3 | Vector3 | Colour3Array;
    intensity?: number;
}

export class Light extends Component
{
    static BlockIndex = new Map<string, any>();
    static BindingPoint = new Map<string, number>();

    private _buffer: WebGLBuffer | undefined;
    protected readonly _bufferData: Float32Array;
    
    private readonly _intensity: Scalar;
    private readonly _colour: Colour3;

    get Intensity(): number
    {
        return this._intensity.Value;
    }

    set Intensity(intensity: number | Scalar)
    {
        if (typeof intensity === 'number')
        {
            this._intensity.Value = intensity;
        }
        else
        {
            this._intensity.Value = intensity.Value;
        }
    }

    get Colour():  Colour3
    {
        return this._colour;
    }

    set Colour(colour: Colour3 | Vector3 | Vector3Array)
    {
        this._colour.Set(colour as Vector3Array);
    }

    get LightBuffer(): WebGLBuffer | undefined
    {
        return this._buffer;
    }

    constructor(
        colour: Colour3 | Vector3 | Colour3Array = [0.7, 0.7, 0.7],
        intensity: number = 1.0,
        data: Float32Array = new Float32Array(4)
    )
    {
        super(Light);

        this._bufferData = data;
        this._colour = new Colour3(this._bufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 0);
        this._intensity = new Scalar(this._bufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 3);

        this._colour.Set(colour as Colour3Array);
        this._intensity.Set(intensity);
    }

    Init(context: WebGL2RenderingContext): void
    {
        this._buffer = context.createBuffer()!;
    }
    
    Bind(shader: Shader, ..._args: any[]): void
    {
        throw new Error('Please implement')
    }
    
    BindBlock(shader: Shader, ..._args: any[]): void
    {
        throw new Error('Please implement')
    }
}
