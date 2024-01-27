import { Colour3, Colour3Array, FixedLengthArray, GL, IsBindable, Scalar, Vector3, Vector3Array } from "@fwge/common";
import { Shader } from "../../base";
import { Component } from "@fwge/ecs";

export interface ILight
{
    colour?: Colour3 | Vector3 | FixedLengthArray<number, 3>;
    intensity?: number;
}

export class Light extends Component implements IsBindable<Float32Array>
{
    static BlockIndex = new Map<string, any>();
    static BindingPoint = new Map<string, number>();

    readonly LightBuffer = GL.createBuffer()!;

    private _intensity: Scalar;
    readonly _colour: Colour3;

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

    get Colour(): Colour3
    {
        return this._colour;
    }

    set Colour(colour: Colour3 | Vector3 | Vector3Array)
    {
        this._colour.Set(colour as Vector3Array);
    }

    constructor(
        colour: Colour3 | Vector3 | Colour3Array = [0.7, 0.7, 0.7],
        intensity: number = 1.0,
        readonly BufferData: Float32Array = new Float32Array(4)
    )
    {
        super(Light);

        this._colour = new Colour3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 0);
        this._intensity = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 3);

        this.Colour.Set(colour as Colour3Array);
        this._intensity.Set(intensity);
    }

    Bind(shader: Shader, ..._args: any[]): void
    {
        throw new Error('Please implement')
    }
}
