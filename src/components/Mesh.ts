import { Colour4, Vector2, Vector3, Vector4 } from "../atoms"
import { Component } from "../ecs/Component"
import { GL } from "../ecs/GL"

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
    #positionBuffer: WebGLBuffer | null = null
    #normalBuffer: WebGLBuffer | null = null
    #colourBuffer: WebGLBuffer | null = null
    #uvBuffer: WebGLBuffer | null = null
    #indexBuffer: WebGLBuffer | null = null
    #wireframeBuffer: WebGLBuffer | null = null
    #vertices: number = 0
    #indices: number = 0
    #wireframe: number = 0
    #dynamic: boolean = false
    
    set Position(buffer: Float32Array | Vector3[] | number[])
    {
        if (!this.#dynamic)
        {
            GL.deleteBuffer(this.#positionBuffer)
        }

        if (!this.#positionBuffer)
        {
            this.#positionBuffer = GL.createBuffer()
        }

        buffer = new Float32Array(buffer[0] instanceof Vector3 ? flatten(buffer as Vector3[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this.#positionBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this.#dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
        
        this.#vertices = buffer.length
    }

    get PositionBuffer(): WebGLBuffer | null
    {
        return this.#positionBuffer
    }

    set Normal(buffer: Float32Array | Vector3[] | number[] | null)
    {
        if (!this.#dynamic || !buffer)
        {
            GL.deleteBuffer(this.#normalBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this.#normalBuffer)
        {
            this.#normalBuffer = GL.createBuffer()
        }
        
        buffer = new Float32Array(buffer[0] instanceof Vector3 ? flatten(buffer as Vector3[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this.#normalBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this.#dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    get NormalBuffer(): WebGLBuffer | null
    {
        return this.#normalBuffer
    }

    set UV(buffer: Float32Array | Vector2[] | number[] | null)
    {
        if (!this.#dynamic || !buffer)
        {
            GL.deleteBuffer(this.#uvBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this.#uvBuffer)
        {
            this.#uvBuffer = GL.createBuffer()
        }
        
        buffer = new Float32Array(buffer[0] instanceof Vector2 ? flatten(buffer as Vector2[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this.#uvBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this.#dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    get UVBuffer(): WebGLBuffer | null
    {
        return this.#uvBuffer
    }

    set Colour(buffer: Float32Array | Vector4[] | Colour4[] | number[] | null)
    {
        if (!this.#dynamic || !buffer)
        {
            GL.deleteBuffer(this.#colourBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this.#colourBuffer)
        {
            this.#colourBuffer = GL.createBuffer()
        }
        
        buffer = new Float32Array(buffer[0] instanceof Vector4 ? flatten(buffer as Vector4[]) : buffer as number[])
        GL.bindBuffer(GL.ARRAY_BUFFER, this.#colourBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, this.#dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)
    }

    get ColourBuffer(): WebGLBuffer | null
    {
        return this.#colourBuffer
    }

    set Index(buffer: Uint8Array | number[] | null)
    {
        if (!this.#dynamic || !buffer)
        {
            GL.deleteBuffer(this.#indexBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this.#indexBuffer)
        {
            this.#indexBuffer = GL.createBuffer()
        }
        
        buffer = new Uint8Array(buffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.#indexBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, buffer, this.#dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)

        this.#indices = buffer.length
    }

    get IndexBuffer(): WebGLBuffer | null
    {
        return this.#indexBuffer
    }

    set Wireframe(buffer: Uint8Array | number[] | null)
    {
        if (!this.#dynamic || !buffer)
        {
            GL.deleteBuffer(this.#wireframeBuffer)
        }
        
        if (!buffer)
        {
            return
        }
        
        if (!this.#wireframeBuffer)
        {
            this.#wireframeBuffer = GL.createBuffer()
        }
        
        buffer = new Uint8Array(buffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.#wireframeBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, buffer, this.#dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW)

        this.#wireframe = buffer.length
    }

    get WireframeBuffer(): WebGLBuffer | null
    {
        return this.#wireframeBuffer
    }

    get VertexCount(): number
    {
        return this.#vertices
    }

    get IndexCount(): number
    {
        return this.#indices
    }

    get WireframeCount(): number
    {
        return this.#wireframe
    }

    constructor(args: IMesh)
    {
        super()
        
        this.Position = args.position
        this.Normal = args.normal ?? null
        this.Colour = args.colour ?? null
        this.UV = args.uv ?? null
        this.Index = args.index ?? null
        this.Wireframe = args.wireframe ?? null
        this.#dynamic = args.dynamic ?? false
    }
}
