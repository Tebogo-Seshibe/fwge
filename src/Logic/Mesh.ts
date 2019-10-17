import { GL } from '../FWGE';
import Item from '../Item';
import Colour4 from './Colour/Colour4';
import Vector2 from './Maths/Vector2';
import Vector3 from './Maths/Vector3';
import Vector4 from './Maths/Vector4';
import ArrayUtils from './Utility/ArrayUtils';

export enum BufferType
{
    INDEX,
    POSITION
}

export function BindBufferData(type: BufferType, data: number[]): WebGLBuffer
{
    if (!data || data.length <= 0)
        return null
    
    let buffer = GL.createBuffer()

    switch (type)
    {
        case BufferType.INDEX:
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), GL.STATIC_DRAW)
        break

        case BufferType.POSITION:
            GL.bindBuffer(GL.ARRAY_BUFFER, buffer)
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW)
        break
    }

    return buffer
}

export class IMesh
{
    name?: string
    position?: Vector3[] | Float32Array | number[]
    uv?: Vector2[] | Float32Array | number[]
    colour?: Vector4[] | Float32Array | number[]
    normal?: Vector3[] | Float32Array | number[]
    index?: Uint8Array | number[]
    wireframe?: Uint8Array | number[]
}

export default class Mesh extends Item
{
    public readonly PositionBuffer: WebGLBuffer
    public readonly UVBuffer: WebGLBuffer
    public readonly ColourBuffer: WebGLBuffer
    public readonly NormalBuffer: WebGLBuffer
    public readonly IndexBuffer: WebGLBuffer
    public readonly WireframeBuffer: WebGLBuffer
    public readonly VertexCount: number
    public readonly WireframeCount: number

    constructor({ name = 'Mesh', position = [], uv = [], colour = [], normal = [], index = [], wireframe = [] }: IMesh = new IMesh)
    {
        super(name)

        if (position.length > 0)
        {
            if(position[0] instanceof Vector3)
            {
                position = ArrayUtils.Flatten(position)
            }

            this.PositionBuffer = BindBufferData(BufferType.POSITION, position as number[])
        }

        if (normal.length > 0)
        {
            if (normal[0] instanceof Vector3)
            {
                normal = ArrayUtils.Flatten(normal)
            }

            this.NormalBuffer = BindBufferData(BufferType.POSITION, normal as number[])
        }

        if (colour.length > 0)
        {
            if (colour[0] instanceof Colour4)
            {
                colour = ArrayUtils.Flatten(colour)
            }

            this.ColourBuffer = BindBufferData(BufferType.POSITION, colour as number[])
        }

        if (uv.length > 0)
        {
            if (uv[0] instanceof Vector2)
            {
                uv = ArrayUtils.Flatten(uv)
            }

            this.UVBuffer = BindBufferData(BufferType.POSITION, uv as number[])
        }

        this.IndexBuffer = BindBufferData(BufferType.INDEX, index as number[])
        this.WireframeBuffer = BindBufferData(BufferType.INDEX, wireframe as number[])

        this.VertexCount = index.length
        this.WireframeCount = wireframe.length
    }
}


