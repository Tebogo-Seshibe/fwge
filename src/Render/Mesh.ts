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
    position?: Vector3[] | Float32Array | number[]
    uv?: Vector2[] | Float32Array | number[]
    colour?: Vector4[] | Float32Array | number[]
    normal?: Vector3[] | Float32Array | number[]
    index?: Uint8Array | number[]
    wireframe?: Uint8Array | number[]
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

    constructor({ name = 'Mesh', position, uv, colour, normal, index, wireframe }: IMesh = new IMesh)
    {
        super(name)

        if (colour && colour.length === 0)
        {
            colour = undefined
        }

        if (uv && uv.length === 0)
        {
            uv = undefined
        }

        if (wireframe && wireframe.length === 0)
        {
            wireframe = undefined
        }

        this.PositionBuffer = this.Bind(FWGE.GL, BufferType.POSITION, position)
        this.UVBuffer = this.Bind(FWGE.GL, BufferType.POSITION, uv)
        this.ColourBuffer = this.Bind(FWGE.GL, BufferType.POSITION, colour)
        this.NormalBuffer = this.Bind(FWGE.GL, BufferType.POSITION, normal)
        this.IndexBuffer = this.Bind(FWGE.GL, BufferType.INDEX, index)
        this.WireframeBuffer = this.Bind(FWGE.GL, BufferType.INDEX, wireframe)

        this.VertexCount = index.length
    }

    private Bind(gl: WebGLRenderingContext, type: BufferType, data?: Uint8Array | number[]): WebGLBuffer
    private Bind(gl: WebGLRenderingContext, type: BufferType, data?: Float32Array | number[]): WebGLBuffer
    private Bind(gl: WebGLRenderingContext, type: BufferType, data?: Vector2[] | Float32Array | number[]): WebGLBuffer
    private Bind(gl: WebGLRenderingContext, type: BufferType, data?: Vector3[] | Float32Array | number[]): WebGLBuffer
    private Bind(gl: WebGLRenderingContext, type: BufferType, data?: Vector4[] | Float32Array | number[]): WebGLBuffer
    private Bind(gl: WebGLRenderingContext, type: BufferType, data?: Vector4[] | Vector3[] | Vector2[] | Float32Array | Uint8Array | number[]): WebGLBuffer
    {
        if (!data)
        {
            return null
        }

        let buffer = gl.createBuffer()
        data = ArrayUtiils.Flatten(data)        

        switch (type)
        {
            case BufferType.INDEX:
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW)
            break

            case BufferType.POSITION:
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
            break
        }

        return buffer
    }

    private Unbind(gl: WebGLRenderingContext, buffer: WebGLBuffer): void
    {
        gl.deleteBuffer(buffer)
    }
}
