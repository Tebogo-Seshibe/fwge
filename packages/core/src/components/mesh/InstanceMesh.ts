import { Matrix4, Vector3, Vector3Array } from "@fwge/common"
import { ITransform, Transform } from "../Transform"
import { IMesh, Mesh } from "./Mesh"
import { COLOUR_SIZE, MODEL_VIEW_MATRIX_SIZE, NORMAL_SIZE, POSITION_SIZE, UV_SIZE } from "./constants";

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
    instances: ITransform[]
}

export class InstanceMesh extends Mesh
{
    private readonly transformBuffer: Float32Array

    readonly InstanceCount: number
    readonly MatrixOffset: number
    readonly Instances: Transform[] = []

    constructor(args: IInstanceMesh)
    {
        super(args.position.length, args.index, args.name ?? 'Instance Mesh')

        const vertexSizeInBytes =
              POSITION_SIZE
            + (args.normal ? NORMAL_SIZE : 0)
            + (args.uv     ? UV_SIZE     : 0)
            + (args.colour ? COLOUR_SIZE : 0)

        const vertexBufferSize = vertexSizeInBytes * args.position.length
        const matrixBufferSize = MODEL_VIEW_MATRIX_SIZE * args.instances.length
        const totalBufferSize = vertexBufferSize + matrixBufferSize;

        const transforms = Vector3.SIZE * 3 * args.instances.length
        const matrices = Matrix4.SIZE * args.instances.length

        this.transformBuffer = new Float32Array(transforms + matrices)
        this.MatrixOffset = transforms
        this.InstanceCount = args.instances.length

        /**
         * Buffer data arrangement
         * P: Position
         * N: Normal
         * U: UV
         * C: Colour
         * M: ModelViewMatrx
         * 
         * [PNUV][PNUV]...[M]...[M]
         */
        for (const transform of args.instances)
        {
            
        }
    }

    SetTransform(index: number, position: Vector3 | Vector3Array, rotation: Vector3 | Vector3Array, scale: Vector3 | Vector3Array)
    {
        if (index < 0 || index >= this.InstanceCount)
        {
            throw new Error('Index out of range')
        }
        
        this.transformBuffer[index + 0] = position[0]
        this.transformBuffer[index + 1] = position[1]
        this.transformBuffer[index + 2] = position[2]
        
        this.transformBuffer[index + 3] = rotation[3]
        this.transformBuffer[index + 4] = rotation[4]
        this.transformBuffer[index + 5] = rotation[5]
        
        this.transformBuffer[index + 6] = scale[6]
        this.transformBuffer[index + 7] = scale[7]
        this.transformBuffer[index + 8] = scale[8]
    }

    GetTransform(index: number): InstanceTransform
    {
        if (index < 0 || index >= this.InstanceCount)
        {
            throw new Error('Index out of range')
        }

        return new InstanceTransform(
            new Vector3(this.transformBuffer.buffer, Vector3.BYTES_PER_ELEMENT * (index + 0)),
            new Vector3(this.transformBuffer.buffer, Vector3.BYTES_PER_ELEMENT * (index + 3)),
            new Vector3(this.transformBuffer.buffer, Vector3.BYTES_PER_ELEMENT * (index + 6)),
        )
    }
}