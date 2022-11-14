import { Matrix4, Vector3, Vector3Array } from "@fwge/common"
import { Transform } from "../Transform"
import { IMesh, Mesh } from "./Mesh"

export interface IInstanceTransform
{
    position: Vector3 | Vector3Array
    rotation: Vector3 | Vector3Array
    scale: Vector3 | Vector3Array
}

export class InstanceTransform
{
    constructor(
        readonly Position: Vector3,
        readonly Rotation: Vector3,
        readonly Scale: Vector3,
    ) { }
}

export interface IInstanceMesh extends IMesh
{
    instances: IInstanceTransform[]
}

export class InstanceMesh extends Mesh
{
    private readonly _buffer: Float32Array

    readonly InstanceCount: number
    readonly MatrixOffset: number
    readonly Instances: Transform[] = []

    constructor(args: IInstanceMesh)
    {
        super(args.position.length, args.index)

        const transforms = Vector3.SIZE * 3 * args.instances.length
        const matrices = Matrix4.SIZE * args.instances.length

        this._buffer = new Float32Array(transforms + matrices)
        this.MatrixOffset = transforms
        this.InstanceCount = args.instances.length

        for (const transform of args.instances)
        {
            
        }
    }

    SetTransform(index: number, position: Vector3 | Vector3Array, rotation: Vector3 | Vector3Array, scale: Vector3 | Vector3Array)
    {
        if (index >= this.InstanceCount)
        {
            throw new Error('Index out of range')
        }
        
        this._buffer[index + 0] = position[0]
        this._buffer[index + 1] = position[1]
        this._buffer[index + 2] = position[2]
        
        this._buffer[index + 3] = rotation[3]
        this._buffer[index + 4] = rotation[4]
        this._buffer[index + 5] = rotation[5]
        
        this._buffer[index + 6] = scale[6]
        this._buffer[index + 7] = scale[7]
        this._buffer[index + 8] = scale[8]
    }

    GetTransform(index: number): InstanceTransform
    {
        if (index >= this.InstanceCount)
        {
            throw new Error('Index out of range')
        }

        return new InstanceTransform(
            new Vector3(this._buffer.buffer, Vector3.BYTES_PER_ELEMENT * (index + 0)),
            new Vector3(this._buffer.buffer, Vector3.BYTES_PER_ELEMENT * (index + 3)),
            new Vector3(this._buffer.buffer, Vector3.BYTES_PER_ELEMENT * (index + 6)),
        )
    }
}