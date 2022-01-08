import { Colour4, Vector2, Vector3, Vector4 } from "../atoms"
import { Component } from "../ecs/Component"
import { GL } from "../ecs/Game"

export interface IMesh
{
    position: Vector3[] | number[]
    normal?: Vector3[] | number[]
    colour?: Vector4[] | Colour4[] | number[]
    uv?: Vector2[] | number[]
    index?: number[]
    wireframe?: number[]
    dynamic?: boolean
}

function flatten(src: Vector2[] | Vector3[] | Vector4[]): Float32Array
{
    const dest: number[] = []

    for (const vec of src)
    {
        dest.push(...vec)
    }

    return new Float32Array(dest)
}

export class Mesh extends Component
{
    public _positionBuffer: WebGLBuffer | null = null
    public _normalBuffer: WebGLBuffer | null = null
    public _colourBuffer: WebGLBuffer | null = null
    public _uvBuffer: WebGLBuffer | null = null
    public _indexBuffer: WebGLBuffer | null = null
    public _wireframeBuffer: WebGLBuffer | null = null
    public _vertices: number = 0
    public _indices: number = 0
    public _wireframe: number = 0
    public _dynamic: boolean = false
    
    public set Position(buffer: Float32Array | Vector3[] | number[])
    {
        if (!this._dynamic)
        {
            GL.deleteBuffer(this._positionBuffer)
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

    public get PositionBuffer(): WebGLBuffer | null
    {
        return this._positionBuffer
    }

    public set Normal(buffer: Float32Array | Vector3[] | number[] | null)
    {
        if (!this._dynamic || !buffer)
        {
            GL.deleteBuffer(this._normalBuffer)
        }
        
        if (!buffer)
        {
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

    public get NormalBuffer(): WebGLBuffer | null
    {
        return this._normalBuffer
    }

    public set UV(buffer: Float32Array | Vector2[] | number[] | null)
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

    public get UVBuffer(): WebGLBuffer | null
    {
        return this._uvBuffer
    }

    public set Colour(buffer: Float32Array | Vector4[] | Colour4[] | number[] | null)
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
        
        buffer = new Float32Array(buffer[0] instanceof Vector4 ? flatten(buffer as Vector4[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this._colourBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this._dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    public get ColourBuffer(): WebGLBuffer | null
    {
        return this._colourBuffer
    }

    public set Index(buffer: Uint8Array | number[] | null)
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

    public get IndexBuffer(): WebGLBuffer | null
    {
        return this._indexBuffer
    }

    public set Wireframe(buffer: Uint8Array | number[] | null)
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

    public get WireframeBuffer(): WebGLBuffer | null
    {
        return this._wireframeBuffer
    }

    public get VertexCount(): number
    {
        return this._vertices
    }

    public get IndexCount(): number
    {
        return this._indices
    }

    public get WireframeCount(): number
    {
        return this._wireframe
    }

    constructor(args: IMesh)
    {
        super(Mesh)
        
        this.Position = args.position
        this.Normal = args.normal ?? null
        this.Colour = args.colour ?? null
        this.UV = args.uv ?? null
        this.Index = args.index ?? null
        this.Wireframe = args.wireframe ?? null
        this._dynamic = args.dynamic ?? false
    }
}
