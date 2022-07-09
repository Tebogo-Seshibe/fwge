import { Colour4, GL, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Mesh } from './Mesh'

const POSITION_INDEX: number    = 0
const NORMAL_INDEX: number      = 1
const UV_INDEX: number          = 2
const COLOUR_INDEX: number      = 3
interface IMesh
{
    position?: Vector3[] | number[]
    normal?: Vector3[] | number[]
    colour?: Vector4[] | Colour4[] | number[]
    uv?: Vector2[] | number[]
    index?: number[]
    wireframe?: number[]
    dynamic?: boolean
}

export class DynamicMesh extends Mesh
{
    _positionBuffer: WebGLBuffer | null = null
    _normalBuffer: WebGLBuffer | null = null
    _colourBuffer: WebGLBuffer | null = null
    _uvBuffer: WebGLBuffer | null = null
    _indexBuffer: WebGLBuffer | null = null
    _wireframeBuffer: WebGLBuffer | null = null
    _dynamic: boolean = true

    get PositionBuffer(): WebGLBuffer | null
    {
        return this._positionBuffer
    }

    set Position(buffer: Float32Array | Vector3[] | number[] | null)
    {
        if (!this._dynamic)
        {
            GL.deleteBuffer(this._positionBuffer)
        }

        if (!buffer)
        {
            return
        }

        if (!this._positionBuffer)
        {
            this._positionBuffer = GL.createBuffer()
        }

        buffer = new Float32Array(buffer[0] instanceof Vector3 ? flatten(buffer as Vector3[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this._positionBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
        
        this.vertexCount = buffer.length
    }

    set Normal(buffer: Float32Array | Vector3[] | number[] | null)
    {
        if (!this._dynamic || !buffer)
        {
            GL.deleteBuffer(this._normalBuffer)
        }
        
        if (!buffer)
        {
            console.groupEnd()
            return
        }
        
        if (!this._normalBuffer)
        {
            this._normalBuffer = GL.createBuffer()
        }
        
        buffer = new Float32Array(buffer[0] instanceof Vector3 ? flatten(buffer as Vector3[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this._normalBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    get NormalBuffer(): WebGLBuffer | null
    {
        return this._normalBuffer
    }

    set UV(buffer: Float32Array | Vector2[] | number[] | null)
    {
        if (!this._dynamic || !buffer)
        {
            GL.deleteBuffer(this._uvBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this._uvBuffer)
        {
            this._uvBuffer = GL.createBuffer()
        }
        
        buffer = new Float32Array(buffer[0] instanceof Vector2 ? flatten(buffer as Vector2[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this._uvBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    get UVBuffer(): WebGLBuffer | null
    {
        return this._uvBuffer
    }

    set Colour(buffer: Float32Array | Vector4[] | Colour4[] | number[] | null)
    {
        if (!this._dynamic || !buffer)
        {
            GL.deleteBuffer(this._colourBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this._colourBuffer)
        {
            this._colourBuffer = GL.createBuffer()
        }
        
        buffer = new Float32Array(
            buffer[0] instanceof Vector4
            ? flatten(buffer as Vector4[])
            : buffer[0] instanceof Colour4
                ? flatten(buffer as Colour4[])
                : buffer as number[])

        GL.bindBuffer(GL.ARRAY_BUFFER, this._colourBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    get ColourBuffer(): WebGLBuffer | null
    {
        return this._colourBuffer
    }

    set Index(buffer: Uint8Array | number[] | null)
    {
        if (!this._dynamic || !buffer)
        {
            GL.deleteBuffer(this._indexBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this._indexBuffer)
        {
            this._indexBuffer = GL.createBuffer()
        }
        
        buffer = new Uint8Array(buffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._indexBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)

        this.indexCount = buffer.length
    }

    set Wireframe(buffer: Uint8Array | number[] | null)
    {
        if (!this._dynamic || !buffer)
        {
            GL.deleteBuffer(this._wireframeBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this._wireframeBuffer)
        {
            this._wireframeBuffer = GL.createBuffer()
        }
        
        buffer = new Uint8Array(buffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._wireframeBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)

        this.wireframeCount = buffer.length
    }

    constructor()
    constructor(args: IMesh)
    constructor(args: IMesh = { })
    {
        super(
            args.position?.length ?? 0 * Vector3.SIZE,
            args.index?.length ?? -1,
            args.wireframe?.length ?? -1
        )
        
        this.Position = args.position ?? null
        this.Normal = args.normal ?? null
        this.Colour = args.colour ?? null
        this.UV = args.uv ?? null
        this.Index = args.index ?? null
        this.Wireframe = args.wireframe ?? null

        GL.bindVertexArray(this.VertexArrayBuffer)
        
        if (this.PositionBuffer)
        {
            GL.enableVertexAttribArray(POSITION_INDEX)
            GL.bindBuffer(GL.ARRAY_BUFFER, this.PositionBuffer)
            GL.vertexAttribPointer(POSITION_INDEX, 3, GL.FLOAT, false, 0, 0)
        }
        
        if (this.NormalBuffer)
        {
            GL.enableVertexAttribArray(NORMAL_INDEX)
            GL.bindBuffer(GL.ARRAY_BUFFER, this.NormalBuffer)
            GL.vertexAttribPointer(NORMAL_INDEX, 3, GL.FLOAT, false, 0, 0)
        }
        
        if (this.UVBuffer)
        {
            GL.enableVertexAttribArray(UV_INDEX)
            GL.bindBuffer(GL.ARRAY_BUFFER, this.UVBuffer)
            GL.vertexAttribPointer(UV_INDEX, 2, GL.FLOAT, false, 0, 0)
        }
        
        if (this.ColourBuffer)
        {
            GL.enableVertexAttribArray(COLOUR_INDEX)
            GL.bindBuffer(GL.ARRAY_BUFFER, this.ColourBuffer)
            GL.vertexAttribPointer(COLOUR_INDEX, 4, GL.FLOAT, false, 0, 0)
        }

        GL.bindVertexArray(null)
    }
}

function flatten(src: Vector2[] | Vector3[] | Vector4[] | Colour4[]): Float32Array
{
    const dest: number[] = []

    for (const vec of src)
    {
        for (const val of vec)
        {
            dest.push(val)
        }
    }

    return new Float32Array(dest)
}
