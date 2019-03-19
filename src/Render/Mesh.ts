import ArrayUtiils from '../Utility/ArrayUtils'
import FWGE from '../FWGE'
import Item from '../Item'
import Vector2 from '../Maths/Vector2'
import Vector3 from '../Maths/Vector3'
import Vector4 from '../Maths/Vector4'

export enum BufferType
{
    INDEX,
    POSITION
}

export class IMesh
{
    name?: string
    position?: Array<Vector3> | Float32Array | Array<number>
    uv?: Array<Vector2> | Float32Array | Array<number>
    colour?: Array<Vector4> | Float32Array | Array<number>
    normal?: Array<Vector3> | Float32Array | Array<number>
    index?: Uint8Array | Array<number>
    wireframe?: Uint8Array | Array<number>
}

export default class Mesh extends Item
{
    public PositionBuffer: WebGLBuffer
    public UVBuffer: WebGLBuffer
    public ColourBuffer: WebGLBuffer
    public NormalBuffer: WebGLBuffer
    public IndexBuffer: WebGLBuffer
    public WireframeBuffer: WebGLBuffer
    public VertexCount: number

    constructor({ name = 'Mesh', position, uv, colour, normal, index, wireframe }: IMesh = new IMesh())
    {
        super(name)

        this.PositionBuffer = this.Bind(FWGE.GL, BufferType.POSITION, position)
        this.UVBuffer = this.Bind(FWGE.GL, BufferType.POSITION, uv)
        this.ColourBuffer = this.Bind(FWGE.GL, BufferType.POSITION, colour)
        this.NormalBuffer = this.Bind(FWGE.GL, BufferType.POSITION, normal)
        this.IndexBuffer = this.Bind(FWGE.GL, BufferType.INDEX, index)
        this.WireframeBuffer = this.Bind(FWGE.GL, BufferType.INDEX, wireframe)

        this.VertexCount = index.length
    }

    Bind(gl: WebGLRenderingContext, type: BufferType, data?: Array<Vector2> | Float32Array | Array<number>): WebGLBuffer
    Bind(gl: WebGLRenderingContext, type: BufferType, data?: Array<Vector3> | Float32Array | Array<number>): WebGLBuffer
    Bind(gl: WebGLRenderingContext, type: BufferType, data?: Array<Vector4> | Float32Array | Array<number>): WebGLBuffer
    Bind(gl: WebGLRenderingContext, type: BufferType, data?: Uint8Array | Array<number>): WebGLBuffer
    Bind(gl: WebGLRenderingContext, type: BufferType, data?: Array<number>): WebGLBuffer
    Bind(gl: WebGLRenderingContext, type: BufferType, data?: Array<Vector4> | Array<Vector3> | Array<Vector2> | Float32Array | Uint8Array | Array<number>): WebGLBuffer
    {
        if (!data)
            return null

        let buffer = gl.createBuffer()
        
        /*if (data instanceof Array)
        {
            data = ArrayUtiils.FlattenVector(data as Array<Vector4>)
        }

        if (data instanceof List)
        {
            data = ListUtiils.FlattenVector(data as List<Vector4>)
        }*/

        switch (type)
        {
            case BufferType.INDEX:
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array((<any>data)), gl.STATIC_DRAW)
            break

            case BufferType.POSITION:
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((<any>data)), gl.STATIC_DRAW)
            break
        }

        return buffer
    }

    Unbind(gl: WebGLRenderingContext, buffer: WebGLBuffer): void
    {
        gl.deleteBuffer(buffer)
    }
}
