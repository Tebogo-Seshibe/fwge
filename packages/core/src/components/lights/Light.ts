import { Colour3, Colour3Array, IsBindable, Scalar, Vector3, Vector3Array } from "@fwge/common";
import { Game, Shader } from "../../base";
import { Component } from "../../ecs";

export interface LightArgs
{
    colour?: Colour3 | Vector3 | Colour3Array;
    intensity?: number;
}

export class Light extends Component implements IsBindable<Float32Array>
{
    static BlockIndex = new Map<string, any>();
    static BindingPoint = new Map<string, number>();

    private _buffer: WebGLBuffer | undefined;
    private _intensity: Scalar;
    private _colour: Colour3;

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

    public get LightBuffer(): WebGLBuffer | undefined
    {
        return this._buffer;
    }

    constructor(
        game: Game,
        colour: Colour3 | Vector3 | Colour3Array = [0.7, 0.7, 0.7],
        intensity: number = 1.0,
        readonly BufferData: Float32Array = new Float32Array(4)
    )
    {
        super(game, Light);

        this._colour = new Colour3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 0);
        this._intensity = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 3);

        this._colour.Set(colour as Colour3Array);
        this._intensity.Set(intensity);
    }

    Init(): void
    {
        this._buffer = this.Game.GL.createBuffer()!;
    }
    
    Bind(shader: Shader, ..._args: any[]): void
    {
        throw new Error('Please implement')
    }
}
