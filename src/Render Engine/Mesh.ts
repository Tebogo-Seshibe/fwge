import FWGE from "../FWGE"
import Item from "../Item"
import List from "../Utility/List"
import Vector2 from "../Maths/Vector2"
import Vector3 from "../Maths/Vector3"
import Vector4 from "../Maths/Vector4"

export class BufferType
{
    static INDEX: number = 0
    static POSITION: number = 1
}

export class IMesh
{
    name?: string = 'Mesh'
    position?: Array<Vector3> | List<Vector3> | Float32Array | Array<number> | List<number>
    uv?: Array<Vector2> | List<Vector2> | Float32Array | Array<number> | List<number>
    colour?: Array<Vector4> | List<Vector4> | Float32Array | Array<number> | List<number>
    normal?: Array<Vector3> | List<Vector3> | Float32Array | Array<number> | List<number>
    index?: Uint8Array | Array<number> | List<number>
    wireframe?: Uint8Array | Array<number> | List<number>
}

export default class Mesh extends Item
{
    protected PositionBuffer: WebGLBuffer
    protected UVBuffer: WebGLBuffer
    protected ColourBuffer: WebGLBuffer
    protected NormalBuffer: WebGLBuffer
    protected IndexBuffer: WebGLBuffer
    protected WireframeBuffer: WebGLBuffer
    protected VertexCount: number

    constructor({name, position, uv, colour, normal, index, wireframe}: IMesh = new IMesh)
    {
        super(name)

        this.Bind(FWGE.GL, BufferType.POSITION, this.PositionBuffer, position)
        this.Bind(FWGE.GL, BufferType.POSITION, this.UVBuffer, uv)
        this.Bind(FWGE.GL, BufferType.POSITION, this.ColourBuffer, colour)
        this.Bind(FWGE.GL, BufferType.POSITION, this.NormalBuffer, normal)
        this.Bind(FWGE.GL, BufferType.INDEX, this.IndexBuffer, index)
        this.Bind(FWGE.GL, BufferType.INDEX, this.WireframeBuffer, wireframe)
    }

    Bind(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, data?: Array<Vector2> | List<Vector2> | Float32Array | Array<number> | List<number>): void
    Bind(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, data?: Array<Vector3> | List<Vector3> | Float32Array | Array<number> | List<number>): void
    Bind(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, data?: Array<Vector4> | List<Vector4> | Float32Array | Array<number> | List<number>): void
    Bind(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, data?: Uint8Array | Array<number> | List<number>): void
    Bind(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, data?: Array<number> | List<number>): void
    Bind(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, data?: Array<Vector4> | List<Vector4> | Array<Vector3> | List<Vector3> | Array<Vector2> | List<Vector2> | Float32Array | Uint8Array | Array<number> | List<number>): void 
    {
        if (!data)
            return

        gl.deleteBuffer(buffer)
        buffer = gl.createBuffer()

        switch (type)
        {
            case BufferType.INDEX:

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)

            case BufferType.POSITION:

                gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

        }
    }
}
