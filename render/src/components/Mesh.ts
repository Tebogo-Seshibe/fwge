import { Colour4 } from '../base'
import { GL, Vector2, Vector3, Vector4 } from "@fwge/common"
import { SharedComponent } from "@fwge/core"

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

export class Mesh extends SharedComponent
{
    _positionBuffer: WebGLBuffer | null = null
    _normalBuffer: WebGLBuffer | null = null
    _colourBuffer: WebGLBuffer | null = null
    _uvBuffer: WebGLBuffer | null = null
    _indexBuffer: WebGLBuffer | null = null
    _wireframeBuffer: WebGLBuffer | null = null
    _vertices: number = 0
    _indices: number = 0
    _wireframe: number = 0
    _dynamic: boolean = false
    
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
        
        this._vertices = buffer.length
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

        this._indices = buffer.length
    }

    get IndexBuffer(): WebGLBuffer | null
    {
        return this._indexBuffer
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

        this._wireframe = buffer.length
    }

    get WireframeBuffer(): WebGLBuffer | null
    {
        return this._wireframeBuffer
    }

    get VertexCount(): number
    {
        return this._vertices
    }

    get IndexCount(): number
    {
        return this._indices
    }

    get WireframeCount(): number
    {
        return this._wireframe
    }

    constructor()
    constructor(args: IMesh)
    constructor(args: IMesh = { })
    {
        super()
        
        this.Position = args.position ?? null
        this.Normal = args.normal ?? null
        this.Colour = args.colour ?? null
        this.UV = args.uv ?? null
        this.Index = args.index ?? null
        this.Wireframe = args.wireframe ?? null
        this._dynamic = args.dynamic ?? false
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
