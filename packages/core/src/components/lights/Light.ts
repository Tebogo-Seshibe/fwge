import { Colour3, Colour3Array, FixedLengthArray, GL, IBindable, Scalar, Vector3 } from "@fwge/common"
import { Shader } from "../../base"
import { UniqueComponent } from "../../ecs"
import { DoTheThing } from "../material"

export interface ILight
{
    colour?: Colour3 | Vector3 | FixedLengthArray<number, 3>
    intensity?: number
}

export class Light extends UniqueComponent implements IBindable<Float32Array>
{
    static BlockIndex = new Map<string, any>()
    static BindingPoint = new Map<string, number>()

    readonly LightBuffer = GL.createBuffer()!

    private _intensity: Scalar
    readonly Colour: Colour3
    
    get Intensity(): number
    {
        return this._intensity.Value
    }

    set Intensity(intensity: number)
    {
        this._intensity.Value = intensity
    }

    constructor(
        colour: Colour3 | Vector3 | Colour3Array = [0.7, 0.7, 0.7],
        intensity: number = 1.0,
        readonly BufferData: Float32Array = new Float32Array(4)
    ) {
        super(Light)

        this.Colour = new Colour3(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 0)
        this._intensity = new Scalar(this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 3)

        this.Colour.Set(colour as Colour3Array)
        this._intensity.Set(intensity)
    }

    Bind(shader: Shader, ..._args: any[]): void
    {
        // const name = (this as Object).constructor.name + 'Buffer'
        // let blockIndex = Light.BlockIndex.get(name)!
        // let bindingPoint = Light.BindingPoint.get(name)!

        // if (!Light.BlockIndex.has(name))
        // {
        //     bindingPoint = DoTheThing.next().value!
        //     blockIndex = GL.getUniformBlockIndex(shader.Program!, name)!
            
        //     Light.BlockIndex.set(name, blockIndex)
        //     Light.BindingPoint.set(name, bindingPoint)

        //     if (blockIndex !== GL.INVALID_INDEX)
        //     {
        //         GL.uniformBlockBinding(shader.Program!, blockIndex, bindingPoint)
        //         GL.bindBufferBase(GL.UNIFORM_BUFFER, bindingPoint, this.LightBuffer)
        //         GL.bufferData(GL.UNIFORM_BUFFER, this.BufferData, GL.DYNAMIC_DRAW)
        //     }
        // }

        // if (blockIndex !== GL.INVALID_INDEX)
        // {
        //     GL.bindBuffer(GL.UNIFORM_BUFFER, this.LightBuffer)
        //     GL.bufferSubData(GL.UNIFORM_BUFFER, 0, this.BufferData)
        // }
    }
}
