import { Colour4, GL, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Asset } from "../../base"

export interface IMesh
{
    position: Vector3[] | [number, number, number][]
    normal?: Vector3[] | [number, number, number][]
    uv?: Vector2[] | [number, number][]
    colour?: Vector4[] | Colour4[] | [number, number, number, number][]
    index?: number[]
}

export class Mesh extends Asset
{
    readonly VertexArrayBuffer: WebGLVertexArrayObject = GL.createVertexArray()!
    readonly VertexBuffer: WebGLBuffer = GL.createBuffer()!
    
    readonly FaceBuffer: WebGLBuffer | null = null
    readonly EdgeBuffer: WebGLBuffer | null = null
    readonly PointBuffer: WebGLBuffer | null = null
    
    readonly PointCount: number
    readonly EdgeCount: number
    readonly FaceCount: number
    readonly IsIndexed: boolean = false

    constructor(vertexCount: number, indices: number[] | undefined)
    {
        super(Mesh)

        this.FaceCount = indices?.length ?? vertexCount
        this.EdgeCount = indices ? (indices.length * 2) : vertexCount
        this.PointCount = vertexCount

        const faces: number[] = []
        const edges: number[] = []
        const points: number[] = []

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

            this.FaceBuffer = GL.createBuffer()!
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FaceBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(faces), GL.STATIC_DRAW)
            
            this.EdgeBuffer = GL.createBuffer()!
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.EdgeBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(edges), GL.STATIC_DRAW)
            
            this.PointBuffer = GL.createBuffer()!
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.PointBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(points), GL.STATIC_DRAW)
            
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
            this.IsIndexed = true
        }
    }
}