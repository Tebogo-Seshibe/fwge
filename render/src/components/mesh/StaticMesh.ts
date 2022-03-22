import { GL, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Colour4 } from '../../base'
import { Mesh } from './Mesh'

interface IMesh
{
    position: Vector3[] | [number, number, number][]
    normal?: Vector3[] | [number, number, number][]
    colour?: Vector4[] | Colour4[] | [number, number, number, number][]
    uv?: Vector2[] | [number, number][]
    index?: number[]
    wireframe?: number[]
}

export class StaticMesh extends Mesh
{
    public static readonly POSITION_SIZE = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
    public static readonly NORMAL_SIZE = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
    public static readonly COLOUR_SIZE = Colour4.BYTES_PER_ELEMENT * Colour4.SIZE
    public static readonly UV_SIZE = Vector2.BYTES_PER_ELEMENT * Vector2.SIZE
    
    public readonly VertexBuffer: WebGLBuffer | null
    public readonly IndexBuffer: WebGLBuffer | null = null
    public readonly WireframeBuffer: WebGLBuffer | null = null

    public readonly Position: number = 0
    public readonly Normal: number = -1
    public readonly Colour: number = -1
    public readonly UV: number = -1
    public readonly Offset: number
    public readonly Size: number

    public readonly VertexCount: number
    public readonly IndexCount: number
    public readonly WireframeCount: number
    
    constructor(args: IMesh)
    {
        super(Mesh)

        this.VertexCount = args.position.length * Vector3.SIZE
        this.IndexCount = args.index?.length ?? 0
        this.WireframeCount = args.wireframe?.length ?? 0
        this.Size = (
              StaticMesh.POSITION_SIZE * args.position.length
            + StaticMesh.NORMAL_SIZE * (args.normal?.length ?? 0)
            + StaticMesh.COLOUR_SIZE * (args.colour?.length ?? 0)
            + StaticMesh.UV_SIZE * (args.uv?.length ?? 0)
        )
        this.Offset = 
            StaticMesh.POSITION_SIZE
          + StaticMesh.NORMAL_SIZE * (args.normal ? 1 : 0)
          + StaticMesh.COLOUR_SIZE * (args.colour ? 1 : 0)
          + StaticMesh.UV_SIZE * (args.uv ? 1 : 0)
        
        if (args.normal)
        {
            this.Normal = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
        }
        
        if (args.colour)
        {
            this.Colour = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE

            if (args.normal)
            {
                this.Colour += Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
            }
        }

        if (args.uv)
        { 
            this.UV = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
            
            if (args.normal)
            {
                this.UV += Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
            }
        
            if (args.colour)
            {
                this.UV += Colour4.BYTES_PER_ELEMENT * Colour4.SIZE
            }
        }

        const vertexBuffer = new ArrayBuffer(this.Size)
        const positionView = new Float32Array(vertexBuffer)
        const normalView = new Float32Array(vertexBuffer)
        const colourView = new Float32Array(vertexBuffer)
        const uvView = new Float32Array(vertexBuffer)
        
        let offset = 0
        for (let i = 0; i < args.position.length; i++)
        {
            const position = args.position[i] as [number, number, number]

            positionView[offset + 0] = position[0]
            positionView[offset + 1] = position[1]
            positionView[offset + 2] = position[2]

            offset += Vector3.SIZE
            
            if (args.normal)
            {
                const normal = args.normal[i] as [number, number, number]
                
                normalView[offset + 0] = normal[0]
                normalView[offset + 1] = normal[1]
                normalView[offset + 2] = normal[2]

                offset += Vector3.SIZE
            }
            
            if (args.colour)
            {
                const colour = args.colour[i] as [number, number, number, number]
                
                colourView[offset + 0] = colour[0]
                colourView[offset + 1] = colour[1]
                colourView[offset + 2] = colour[2]
                colourView[offset + 3] = colour[3]

                offset += Colour4.SIZE
            }
            
            if (args.uv)
            {
                const uv = args.uv[i] as [number, number]
                
                uvView[offset + 0] = uv[0]
                uvView[offset + 1] = uv[1]

                offset += Vector2.SIZE
            }
        }

        this.VertexBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, vertexBuffer, GL.STATIC_DRAW)
        
        if (args.index)
        {
            this.IndexBuffer = GL.createBuffer()            
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(args.index), GL.STATIC_DRAW)
        }
        
        if (args.wireframe)
        {
            this.WireframeBuffer = GL.createBuffer()
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(args.wireframe), GL.STATIC_DRAW)
        }
    }
}

function flatten(src: Vector2[] | Vector3[] | Vector4[] | Colour4[] | number[][]): Float32Array
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

