import { Colour4, CompositeDataView, GL, SubDataView, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Asset, Game } from "../../base"

export interface IMesh
{
    name?: string
    position: Vector3[] | [number, number, number][]
    normal?: Vector3[] | [number, number, number][]
    uv?: Vector2[] | [number, number][]
    colour?: Vector4[] | Colour4[] | [number, number, number, number][]
    index?: number[]
}

export interface MeshData extends SubDataView
{
    vertices:
    {
        type: Float32ArrayConstructor;
        length: number;
    };
    faces:
    {
        type: Uint8ArrayConstructor;
        length: number;
    };
    edges:
    {
        type: Uint8ArrayConstructor;
        length: number;
    };
    points:
    {
        type: Uint8ArrayConstructor;
        length: number;
    };
}

export class Mesh implements Asset
{
    readonly VertexArrayBuffer: WebGLVertexArrayObject = GL.createVertexArray()!
    readonly VertexBuffer: WebGLBuffer = GL.createBuffer()!
    
    private _faceBuffer: WebGLBuffer | null = null
    get FaceBuffer(): WebGLBuffer | null
    {
        return this._faceBuffer;
    }

    private _edgeBuffer: WebGLBuffer | null = null
    get EdgeBuffer(): WebGLBuffer | null
    {
        return this._edgeBuffer;
    }

    private _pointBuffer: WebGLBuffer | null = null
    get PointBuffer(): WebGLBuffer | null
    {
        return this._pointBuffer;
    }

    
    readonly PointCount: number
    readonly EdgeCount: number
    readonly FaceCount: number
    readonly IsIndexed: boolean = false

    readonly MeshData: CompositeDataView<MeshData>;

    constructor(vertexCount: number, indices: number[] | undefined, name: string)
    {
        this.FaceCount = indices?.length ?? vertexCount
        this.EdgeCount = indices ? (indices.length * 2) : vertexCount
        this.PointCount = vertexCount

        const faces: number[] = []
        const edges: number[] = []
        const points: number[] = []

        this.MeshData = new CompositeDataView({
            vertices: {
                type: Float32Array,
                length: vertexCount
            },
            faces: {
                type: Uint8Array,
                length: this.FaceCount
            },
            edges: {
                type: Uint8Array,
                length: this.EdgeCount
            },
            points: {
                type: Uint8Array,
                length: this.PointCount
            }
        })

        if (indices)
        {
            faces.push(...indices)            
            for (let i = 0; i < indices.length; i += 3)
            {
                edges.push(
                    indices[i + 0], indices[i + 1],
                    indices[i + 1], indices[i + 2],
                    indices[i + 2], indices[i + 0]
                )
            }
            points.push(...new Set(indices))
            

            this.MeshData.View('faces').set(faces)
            this.MeshData.View('edges').set(edges)
            this.MeshData.View('points').set(points)
            
            this.IsIndexed = true
        }
    }
    Load(game: Game): void
    {
        const GL = game.GL;

        this._faceBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FaceBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.MeshData.View('faces'), GL.STATIC_DRAW)
        
        this._edgeBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.EdgeBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.MeshData.View('edges'), GL.STATIC_DRAW)
        
        this._pointBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.PointBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.MeshData.View('points'), GL.STATIC_DRAW)
        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }

    Unload(game: Game): void { }

    Destroy(game: Game): void
    {
        game.GL.deleteBuffer(this._faceBuffer);   
        game.GL.deleteBuffer(this._edgeBuffer);   
        game.GL.deleteBuffer(this._pointBuffer);   
    }    
}
